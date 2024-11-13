import { useState, useEffect } from "react";
import { Table, Checkbox } from "@radix-ui/themes";

const data = [
  {
    id: 1,
    title: "Summer 2025 Supply Chain Intern-Master's Degree",
    company: "Applied Materials",
    location: "Austin, TX, USA",
    type: "Internship",
    posted: "2024-11-13T02:19:49.311Z",
  },
  {
    id: 2,
    title: "New grad software engineer",
    company: "Amazon",
    location: "Dallas, TX, USA",
    type: "Full time",
    posted: "2024-11-12T02:19:49.311Z",
  },
  {
    id: 3,
    title: "Software Developer Internship",
    company: "Google",
    location: "Mountain View, CA, USA",
    type: "Internship",
    posted: "2024-11-11T02:19:49.311Z",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Facebook",
    location: "Austin, TX, USA",
    type: "Full time",
    posted: "2024-11-13T02:18:49.311Z",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Microsoft",
    location: "Redmond, WA, USA",
    type: "Full time",
    posted: "2024-10-13T02:19:49.311Z",
  },
  {
    id: 6,
    title: "Frontend Developer",
    company: "Apple",
    location: "Cupertino, CA, USA",
    type: "Internship",
    posted: "2024-11-13T02:19:49.311Z",
  },
  {
    id: 7,
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Gatos, CA, USA",
    type: "Full time",
    posted: "2024-11-13T02:19:49.311Z",
  },
  {
    id: 8,
    title: "Machine Learning Engineer",
    company: "Tesla",
    location: "Palo Alto, CA, USA",
    type: "Full time",
    posted: "2024-11-13T02:19:49.311Z",
  },
  {
    id: 9,
    title: "Cloud Engineer",
    company: "IBM",
    location: "Austin, TX, USA",
    type: "Internship",
    posted: "2024-11-13T02:19:49.311Z",
  },
  {
    id: 10,
    title: "Security Engineer",
    company: "Cisco",
    location: "San Jose, CA, USA",
    type: "Full time",
    posted: "2024-11-13T02:19:49.311Z",
  },
];

const ITEMS_PER_PAGE = 5;

export function JobsTable() {
  const [rowData, setRowData] = useState([]);
  const [filters, setFilters] = useState({
    company: "",
    location: "",
    type: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "posted",
    direction: "desc",
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    // Sort by 'posted' date descending by default
    const sortedData = [...data].sort(
      (a, b) => new Date(b.posted) - new Date(a.posted)
    );
    setFilteredData(sortedData);
  }, []);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  };

  const applyFilters = () => {
    const filtered = data
      .filter((job) => {
        return (
          (filters.company === "" || job.company === filters.company) &&
          (filters.location === "" || job.location === filters.location) &&
          (filters.type === "" || job.type === filters.type)
        );
      })
      .sort((a, b) => new Date(b.posted) - new Date(a.posted)); // Maintain sorted order by 'posted'
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  function handleCheckBox(e, cellData) {
    let clone = structuredClone(rowData);
    if (e) {
      clone.push(cellData);
    } else {
      clone = clone.filter((job) => job.id !== cellData.id);
    }
    setRowData(clone);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
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
          {[...new Set(data.map((job) => job.company))].map((company) => (
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
          {[...new Set(data.map((job) => job.location))].map((location) => (
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
          {[...new Set(data.map((job) => job.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="text-blue-600">
            <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handleSort("title")}>
              Title{" "}
              {sortConfig.key === "title"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handleSort("company")}>
              Company{" "}
              {sortConfig.key === "company"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handleSort("location")}>
              Location{" "}
              {sortConfig.key === "location"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handleSort("type")}>
              Type{" "}
              {sortConfig.key === "type"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handleSort("posted")}>
              Posted{" "}
              {sortConfig.key === "posted"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {getPaginatedData().length > 0 ? (
            getPaginatedData().map((cellData) => (
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
                <Table.Cell>{formatDate(cellData.posted)}</Table.Cell>
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

      <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
        Apply
      </button>
    </>
  );
}
