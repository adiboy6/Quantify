import React, { useState } from 'react';

// Sample job data
const jobData = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Acme Inc.',
    location: 'New York, NY',
    isSaved: true
  },
  {
    id: 2,
    title: 'UI Designer',
    company: 'Globex Corp.',
    location: 'San Francisco, CA',
    isSaved: false
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'Stark Industries',
    location: 'Chicago, IL',
    isSaved: true
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Wayne Enterprises',
    location: 'Seattle, WA',
    isSaved: false
  }
];

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState(
    jobData.filter(job => job.isSaved)
  );

  const toggleSavedJob = (job) => {
    const updatedJobs = jobData.map(j =>
      j.id === job.id ? { ...j, isSaved: !j.isSaved } : j
    );
    setSavedJobs(updatedJobs.filter(j => j.isSaved));
  };

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-lg font-medium mb-4">Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        <ul className="space-y-4">
          {savedJobs.map(job => (
            <li
              key={job.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className={`h-6 w-6 ${job.isSaved ? 'text-green-500' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-gray-600">
                    {job.company} - {job.location}
                  </p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => toggleSavedJob(job)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No saved jobs.</p>
      )}
    </div>
  );
};

export default SavedJobs;