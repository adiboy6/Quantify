from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime
import pytz
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)

# MongoDB setup
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))
jab_db = client["JAB"]
jobApplications = jab_db["jobApplications"]

# RapidAPI configuration
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
BASE_URL = "https://jsearch.p.rapidapi.com"
HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com"
}

# Route to fetch and store jobs from external API
@app.route('/api/collect_jobs', methods=['POST'])
def collect_jobs():
    query = request.args.get("query", "Tech jobs in USA")
    url = f"{BASE_URL}/search?query={query}&page=2&num_pages=2&date_posted=all"

    # Fetch job data from the external API
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch jobs"}), 500

    data = response.json()
    jobs = []
    
    # Transform data for MongoDB
    for job in data["data"]:
        posted_on = datetime.fromtimestamp(job["job_posted_at_timestamp"], tz=pytz.UTC) if job.get("job_posted_at_timestamp") else None
        last_availability_check = datetime.utcnow().replace(tzinfo=pytz.UTC)
        
        transformed_job = {
            "job_title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": f"{job.get('job_city')}, {job.get('job_state')}, {job.get('job_country')}",
            "job_apply_link": job.get("job_apply_link"),
            "experience_level": ["3+ years"],
            "category": [job.get("job_employment_type")],
            "salary_range": [
                job.get("job_min_salary") if job.get("job_min_salary") is not None else 0,
                job.get("job_max_salary") if job.get("job_max_salary") is not None else 0
            ],
            "posted_on": posted_on,
            "last_availability_check": last_availability_check,
            "status": "active" if job.get("job_apply_link") else "inactive",
            "skills": [],
            "job_category": ["Engineering", "Software Development"],
            "job_description": {
                "basic_req": job.get("job_description", ""),
                "preferred_req": ""
            }
        }
        jobs.append(transformed_job)

    # Insert transformed jobs into MongoDB
    result = jobApplications.insert_many(jobs)
    return jsonify({"status": "success", "inserted_count": len(result.inserted_ids)}), 201

# Route to search jobs based on a query
@app.route('/api/search_jobs', methods=['GET'])
def search_jobs():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Perform a simple text search on job title and description
    results = jobApplications.find({
        "$or": [
            {"job_title": {"$regex": query, "$options": "i"}},
            {"job_description.basic_req": {"$regex": query, "$options": "i"}}
        ]
    })

    # Transform results to JSON
    jobs = []
    for job in results:
        job["_id"] = str(job["_id"])
        jobs.append(job)
    
    return jsonify({"status": "success", "jobs": jobs})

if __name__ == "__main__":
    app.run(debug=True)
