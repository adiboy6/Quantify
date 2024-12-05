import React, { useState, useMemo } from 'react';
import { Select } from '@/components/ui/select';

const JobListings = ({ jobs = [] }) => {
  const [sortOrder, setSortOrder] = useState('desc'); // Default to newest first

  // Memoize the sorted jobs to prevent unnecessary re-sorting
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.postedDate);
      const dateB = new Date(b.postedDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [jobs, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Sorting controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Job Listings</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-order" className="text-sm text-gray-600">
            Sort by date:
          </label>
          <Select
            id="sort-order"
            value={sortOrder}
            onValueChange={setSortOrder}
            className="w-40"
          >
            <Select.Trigger>
              <Select.Value placeholder="Sort by date" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="desc">Newest first</Select.Item>
              <Select.Item value="asc">Oldest first</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Job listings */}
      <div className="space-y-4">
        {sortedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{job.location}</p>
            <p className="mt-2 text-gray-700 line-clamp-2">{job.description}</p>
          </div>
        ))}
        
        {sortedJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No jobs found. Check back later for new opportunities.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;