import React from "react";
import { JobsTable } from "../table.jsx";

export const Jobs = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      {/* <h1 className="text-3xl font-bold text-gray-800">
        Welcome to the Dashboard!
      </h1> */}
      <JobsTable />
    </div>
  );
};
