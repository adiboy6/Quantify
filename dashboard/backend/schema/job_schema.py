from bson import ObjectId
from datetime import datetime

job_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "job_title", "company", "location", "type",
            "experience_level", "category", "salary_range",
            "posted_on", "last_availability_check", "status",
            "skills", "job_category", "job_description"
        ],
        "properties": {
            "_id": {"bsonType": "objectId"},
            "job_title": {"bsonType": "string"},
            "company": {"bsonType": "string"},
            "location": {"bsonType": "string"},
            "type": {"bsonType": "string"},
            "experience_level": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "category": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "salary_range": {
                "bsonType": "array",
                "items": [
                    {"bsonType": "number"},  # Min salary
                    {"bsonType": "number"}   # Max salary
                ],
                "minItems": 2,
                "maxItems": 2
            },
            "posted_on": {"bsonType": "date"},
            "last_availability_check": {"bsonType": "date"},
            "status": {
                "bsonType": "string",
                "enum": ["active", "inactive"]
            },
            "skills": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "job_category": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "job_description": {
                "bsonType": "object",
                "required": ["basic_req", "preferred_req"],
                "properties": {
                    "basic_req": {"bsonType": "string"},
                    "preferred_req": {"bsonType": "string"}
                }
            }
        }
    }
}
