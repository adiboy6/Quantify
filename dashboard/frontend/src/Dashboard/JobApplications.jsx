import { useState, useEffect } from "react";
import { Table, Checkbox } from "@radix-ui/themes";

const ITEMS_PER_PAGE = 5;

export function JobApplications() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    company: "",
    location: "",
    type: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "posted_on",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Fetch job data from the backend
  useEffect(() => {
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

    async function fetchJobs() {
      try {
        // const response = await fetch("http://localhost:5000/api/jobs");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`);
        if (response.ok) {
          const data = await response.json();
          setRowData(data);
          setFilteredData(data);
        } else {
          console.error("Failed to fetch jobs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    fetchJobs();
  }, []);

  // Apply filters and sort
  const applyFilters = () => {
    let filtered = [...rowData];
    if (filters.company) {
      filtered = filtered.filter((job) => job.company === filters.company);
    }
    if (filters.location) {
      filtered = filtered.filter((job) => job.location === filters.location);
    }
    if (filters.type) {
      filtered = filtered.filter((job) => job.type === filters.type);
    }

    // Sort by posted date
    filtered.sort((a, b) =>
      sortConfig.direction === "asc"
        ? new Date(a.posted_on) - new Date(b.posted_on)
        : new Date(b.posted_on) - new Date(a.posted_on)
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSort = () => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: "posted_on", direction });
    const sortedData = [...filteredData].sort((a, b) =>
      direction === "asc"
        ? new Date(a.posted_on) - new Date(b.posted_on)
        : new Date(b.posted_on) - new Date(a.posted_on)
    );
    setFilteredData(sortedData);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
  };

  // Track selected jobs for applying
  const handleCheckboxChange = (job, isChecked) => {
    setSelectedJobs((prevSelected) => {
      if (isChecked) {
        // Add job if not already in selectedJobs
        return [...prevSelected, job];
      } else {
        // Remove job if it's unchecked
        return prevSelected.filter(
          (selectedJob) => selectedJob.job_apply_link !== job.job_apply_link
        );
      }
    });
  };

  const handleApplySelectedJobs = () => {
    if (selectedJobs.length === 0) {
      alert("No jobs selected");
      return;
    }
    selectedJobs.forEach((job) => {
      window.open(job.job_apply_link, "_blank");
    });
  };

  return (
    <>
      <div className="mb-4 flex space-x-4">
        <select
          name="company"
          value={filters.company}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Companies</option>
          {[...new Set(rowData.map((job) => job.company))].map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Locations</option>
          {[...new Set(rowData.map((job) => job.location))].map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Types</option>
          {[...new Set(rowData.map((job) => job.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="text-blue-600">
            <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Company</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={handleSort}>
              Posted {sortConfig.direction === "asc" ? "▲" : "▼"}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {getPaginatedData().length > 0 ? (
            getPaginatedData().map((job, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>
                  <Checkbox
                    defaultChecked={false}
                    onCheckedChange={(e) => handleCheckboxChange(job, e)}
                  />
                </Table.RowHeaderCell>
                <Table.Cell>
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {job.job_title}
                  </a>
                </Table.Cell>
                <Table.Cell>{job.company}</Table.Cell>
                <Table.Cell>{job.location}</Table.Cell>
                <Table.Cell>{job.type}</Table.Cell>
                <Table.Cell>{formatDate(job.posted_on)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center text-gray-500">
                No jobs found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      <div className="mt-4 flex justify-center">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleApplySelectedJobs}
        >
          Apply to Selected Jobs
        </button>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ◀
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-2 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          ▶
        </button>
      </div>
    </>
  );
}
