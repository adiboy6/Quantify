import { useState } from "react";
import { Table, Checkbox } from "@radix-ui/themes";

const data = [
  {
    id: 1,
    title: "Summer 2025 Supply Chain Intern-Master's Degree",
    company: "Applied Materials",
    location: "Austin, TX, USA",
    type: "Internship",
    logo: "/api/placeholder/80/80",
  },
  {
    id: 2,
    title: "New grad software engineer",
    company: "Amazon",
    location: "Dallas, TX, USA",
    type: "Full time",
    logo: "/api/placeholder/80/80",
  },
];

export function JobsTable() {
  const [rowData, setRowData] = useState([]);

  function handleCheckBox(e, cellData) {
    console.log(e);
    let clone = structuredClone(rowData);

    if (e) {
      //add checked job id
      clone.push(cellData);
    } else {
      // remove job id from clone
      clone = clone.filter((job) => job.id !== cellData.id);
    }

    setRowData(clone);
  }

  console.log(rowData);

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
          {data.map((cellData) => (
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
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
        onClick={console.log(rowData)}
      >
        Apply
      </button>
    </>
  );
}
