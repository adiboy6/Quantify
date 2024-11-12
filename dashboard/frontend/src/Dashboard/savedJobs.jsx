// savedJobs.jsx
import { useState, useEffect } from "react";
import { Table, Checkbox } from "@radix-ui/themes";

export function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(() => {
    // Load saved jobs from localStorage when component mounts
    const jobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(jobs);
  }, []);

  function handleCheckBox(e, cellData) {
    let clone = structuredClone(selectedJobs);

    if (e) {
      clone.push(cellData);
    } else {
      clone = clone.filter((job) => job.id !== cellData.id);
    }

    setSelectedJobs(clone);
  }

  const handleDelete = () => {
    if (selectedJobs.length === 0) {
      alert('Please select at least one job to delete');
      return;
    }

    // Remove selected jobs from savedJobs
    const updatedJobs = savedJobs.filter(
      job => !selectedJobs.some(selectedJob => selectedJob.id === job.id)
    );

    // Update localStorage and state
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    setSavedJobs(updatedJobs);
    setSelectedJobs([]); // Clear selections
    alert(`${selectedJobs.length} job(s) deleted successfully!`);
  };

  const handleApply = () => {
    if (selectedJobs.length === 0) {
      alert('Please select at least one job to apply');
      return;
    }
    console.log('Applying for selected jobs:', selectedJobs);
    // Add your apply logic here
  };

  return (
    <>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="text-blue-600">
            <Table.ColumnHeaderCell className="text-blue-600">
              Select
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-blue-600">
              Title
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-blue-600">
              Company
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-blue-600">
              Location
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-blue-600">
              Type
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {savedJobs.map((cellData) => (
            <Table.Row key={cellData.id}>
              <Table.RowHeaderCell>
                <Checkbox
                  defaultChecked={false}
                  onCheckedChange={(e) => handleCheckBox(e, cellData)}
                />
              </Table.RowHeaderCell>
              <Table.Cell>{cellData.title}</Table.Cell>
              <Table.Cell>{cellData.company}</Table.Cell>
              <Table.Cell>{cellData.location}</Table.Cell>
              <Table.Cell>{cellData.type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleApply}
        >
          Apply
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete Selected
        </button>
      </div>

      {selectedJobs.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
        </div>
      )}

      {savedJobs.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No saved jobs found.
        </div>
      )}
    </>
  );
}

export default SavedJobs;