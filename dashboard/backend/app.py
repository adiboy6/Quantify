from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
import io
import io
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.local import LocalProxy
from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId
from bson import ObjectId
import bcrypt
import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from schema.job_schema import job_schema
from datetime import datetime
from dotenv import load_dotenv
from cover_letter import generate_cover_letter
from flask import send_file

load_dotenv()

app = Flask(__name__,static_url_path='',static_folder='static/') 
            
CORS(app)

uri = "mongodb+srv://jab-admin:t3nM4nhzWu8f4kJ6@devcluster.3ih32.mongodb.net/?retryWrites=true&w=majority&appName=DevCluster"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['JAB']
collection = db['jobApplications']
user_profile_collection = db['userProfiles']

# with open('./schema/sample_data.json', 'r') as file:
#     job_data = json.load(file)

# for job in job_data:
#     job['posted_on'] = datetime.strptime(job['posted_on'], "%Y-%m-%dT%H:%M:%SZ")
#     job['last_availability_check'] = datetime.strptime(job['last_availability_check'], "%Y-%m-%dT%H:%M:%SZ")
    

# try:
#     collection.insert_many(job_data)
#     print("Jobs inserted successfully.")
# except Exception as e:
#     print(f"Error inserting jobs: {e}")

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    domains_to_filter = ["boards.greenhouse.io"]
    try:
        jobs = list(collection.find({}, {
            "job_title": 1,
            "company": 1,
            "job_apply_link": 1,
            "location": 1,
            "type": 1,
            "posted_on": 1,
            "_id": 0
        }))

        filtered_jobs = []
        for job in jobs:
            for domain in domains_to_filter:
                if job["job_apply_link"].find(domain) != -1:
                    filtered_jobs.append(job)
                    break
        
        return jsonify(filtered_jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/getUserProfile', methods=['GET'])
def get_profile():
    try:
        userEmail = request.args.get('email')
        query = {"email": userEmail}

        response = user_profile_collection.find(query)
        userProfile = {}

        for entry in response:
            userProfile = json.dumps(entry, default=str)

        # TODO - The user profile should be fetched from mongodb
        # userProfile = {
        #     "firstName": "Norman",
        #     "lastName": "Osborn",
        #     "email": "peter@gmail.com",
        #     "phone": "7118082143",
        #     "city": "Dulles, Virginia, United States",
        #     "linkedIn": "https://linkedin.com/peter",
        #     "salary": "$90000",
        #     "sponsorship": "No",
        #     "authorizedToWork": "No",
        #     "state": "Florida",
        #     "hybridOpinion": "Yes",
        #     "gender": "Male",
        #     "country": "United States of America",
        #     "hispanicOption": "No",
        #     "veteranStatus": "I am not a protected veteran",
        #     "disabilityStatus": "i do not have",
        #     "resumePath": "peter_resume.pdf"
        # }

        return userProfile, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    
def create_formatted_pdf(cover_letter):
    # Replace newline characters with <br /> for line breaks in PDF
    formatted_text = cover_letter.replace("\n", "<br />")

    # Create an in-memory buffer
    buffer = io.BytesIO()

    # Create the PDF document
    doc = SimpleDocTemplate(buffer, pagesize=letter)

    # Define a style for the text
    styles = getSampleStyleSheet()
    style = styles["Normal"]
    
    # Create a Paragraph for the cover letter with the formatted text
    content = [Paragraph(formatted_text, style)]
    
    # Build the PDF
    doc.build(content)
    
    # Move to the beginning of the buffer so it can be sent to the user
    buffer.seek(0)
    return buffer

@app.route('/generate_cover_letter/<job_id>', methods=['GET'])
def generate_cover_letter_api(job_id):
    try:
        # Fetch user profile
        user_email = request.args.get("email")
        user = user_profile_collection.find_one({"email": user_email})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        name = user.get('firstName') + user.get('lastName')

        # Get resume 
        resume_path = user.get("resume")
        # Fetch job details 
        job = collection.find_one({"_id": ObjectId(job_id)})

        job_role = job["job_title"]
        company_name = job["company"]
        description = job["job_description"]

        # Generate cover letter
        cover_letter = generate_cover_letter(name, resume_path, job_role, company_name, description['basic_req'])
        cover_letter = cover_letter.split("\n", 1)[1]
        pdf_buffer = create_formatted_pdf(cover_letter)

        # Send the PDF as a response to the user
        return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cover_letter.pdf")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/createProfile', methods=['POST'])
def createProfile():
    resume_saved_name = ""

    try:
        resume = request.files['resume']
        if resume:
            resume_saved_name = request.form["email"].replace("@","_").replace(".","_")+".pdf"
            resume.save(os.path.join("./static/resume/", resume_saved_name))
    except:
        print("No resume found")

    userProfile = request.form.to_dict()
    userProfile["resume"] = resume_saved_name

    user_profile_collection.insert_one(userProfile)

    return jsonify({"message": "User profile created successfully"}), 201

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    
    # Check if user already exists
    if db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Store the user
    user_id = db.users.insert_one({
        "fullName": full_name,
        "email": email,
        "password": hashed_password
    }).inserted_id
    
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = db.users.find_one({"email": email})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check the password
    if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"message": "Login successful", "user_id": str(user["_id"])}), 200
    else:
        return jsonify({"error": "Invalid password"}), 401

if __name__ == "__main__":
    app.run(port=5000, debug=True)

