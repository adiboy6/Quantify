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

load_dotenv()

app = Flask(__name__,static_url_path='',static_folder='static/') 
            
CORS(app)

uri = os.getenv("MONGO_URI")
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
        return jsonify(jobs), 200
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

