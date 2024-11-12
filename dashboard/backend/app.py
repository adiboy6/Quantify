from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import bcrypt
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # Add your frontend URL
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb+srv://jab-admin:<db_password>@devcluster.3ih32.mongodb.net/?retryWrites=true&w=majority&appName=DevCluster")
mongo = PyMongo(app)
db = mongo.db  

def convert_document(document):
    return {**document, "_id": str(document["_id"])}


try:
    db.list_collection_names()
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    
    
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

# Save a job for a user
@app.route('/saved-jobs', methods=['POST'])
def save_job():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        job_data = {
            "job_id": data.get('id'),
            "title": data.get('title'),
            "company": data.get('company'),
            "location": data.get('location'),
            "type": data.get('type'),
            "logo": data.get('logo'),
            "link": data.get('link'),
            "saved_at": datetime.utcnow(),
            "user_id": user_id
        }

        # Check if job is already saved by this user
        existing_job = db.saved_jobs.find_one({
            "user_id": user_id,
            "job_id": data.get('id')
        })

        if existing_job:
            return jsonify({"error": "Job already saved"}), 400

        result = db.saved_jobs.insert_one(job_data)
        return jsonify({
            "message": "Job saved successfully",
            "saved_job_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all saved jobs for a user
@app.route('/saved-jobs/<user_id>', methods=['GET'])
def get_saved_jobs(user_id):
    try:
        saved_jobs = list(db.saved_jobs.find({"user_id": user_id}))
        # Convert ObjectId to string for JSON serialization
        for job in saved_jobs:
            job['_id'] = str(job['_id'])
        return jsonify(saved_jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Remove a saved job
@app.route('/saved-jobs/<user_id>/<job_id>', methods=['DELETE'])
def remove_saved_job(user_id, job_id):
    try:
        result = db.saved_jobs.delete_one({
            "user_id": user_id,
            "job_id": int(job_id)
        })
        if result.deleted_count > 0:
            return jsonify({"message": "Job removed from saved jobs"}), 200
        return jsonify({"error": "Saved job not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Check if a job is saved by user
@app.route('/saved-jobs/check/<user_id>/<job_id>', methods=['GET'])
def check_saved_job(user_id, job_id):
    try:
        job = db.saved_jobs.find_one({
            "user_id": user_id,
            "job_id": int(job_id)
        })
        return jsonify({
            "is_saved": bool(job),
            "saved_job_id": str(job['_id']) if job else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

