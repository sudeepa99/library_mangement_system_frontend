import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

import viewMoreIcon from "../assets/icons/chevron-down.png";
import deleteIcon from "../assets/icons/trash.png";
import editIcon from "../assets/icons/pencil.png";
import AddBook from "./AddBook";

const BookManagementContent = () => {
  const [expanded, setExpanded] = useState({});
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);

  const handleOpenAddBookDialog = () => {
    setIsAddBookDialogOpen(true);
  };

  const handleCloseAddBookDialog = () => {
    setIsAddBookDialogOpen(false);
  };

  const handleAddBookSubmit = (formData) => {
    console.log("Form submitted with data:", formData);

    // Close the dialog
    setIsAddBookDialogOpen(false);
  };
  const data = useMemo(
    () => [
      {
        ID: 1,
        Title: "ABCD",
        Author: "GFGH",
        Category: "BNHG",
        Copies: 200,
        PublishedYear: 2000,
      },
      {
        ID: 2,
        Title: "ABCD",
        Author: "GFGH",
        Category: "BNHG",
        Copies: 200,
        PublishedYear: 2000,
      },
      {
        ID: 3,
        Title: "ABCD",
        Author: "GFGH",
        Category: "BNHG",
        Copies: 200,
        PublishedYear: 2000,
      },
      {
        ID: 4,
        Title: "ABCD",
        Author: "GFGH",
        Category: "BNHG",
        Copies: 200,
        PublishedYear: 2000,
      },
      {
        ID: 5,
        Title: "ABCD",
        Author: "GFGH",
        Category: "BNHG",
        Copies: 200,
        PublishedYear: 2000,
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "ID",
        header: "ID",
      },
      {
        accessorKey: "Title",
        header: "Title",
      },
      {
        accessorKey: "Author",
        header: "Author",
      },
      {
        accessorKey: "Category",
        header: "Category",
      },
      {
        accessorKey: "Copies",
        header: "Copies",
      },
      {
        accessorKey: "PublishedYear",
        header: "Published Year",
      },
      {
        accessorKey: "Action",
        header: "Action",
        cell: ({ row }) => {
          // Add debug log here
          console.log("Row ID in cell:", row.id);

          return (
            <div className="flex justify-center items-center">
              <img
                src={viewMoreIcon}
                alt="view more"
                className={`w-5 h-5 cursor-pointer transition-transform ${
                  row.getIsExpanded() ? "rotate-180" : ""
                }`}
                onClick={() => {
                  console.log("Clicking row:", row.id);
                  // Use toggleExpanded directly
                  row.toggleExpanded();
                }}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { expanded },
    getRowId: (row) => row.ID.toString(),
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    enableExpanding: true,
  });

  // Add this for debugging
  console.log("Expanded state:", expanded);
  console.log(
    "Table rows:",
    table.getRowModel().rows.map((row) => ({
      id: row.id,
      isExpanded: row.getIsExpanded(),
    }))
  );

  const expandedData = [
    { label: "Name", value: "Joseph William" },
    { label: "Created date", value: "3 months ago" },
  ];

  return (
    <div className="px-[4%] py-[2%]">
      <div className="flex flex-1 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>
        <div className="bg-green-600 rounded-md">
          <button
            className=" px-3 py-2 text-center text-white"
            onClick={handleOpenAddBookDialog}
          >
            Add New Book
          </button>
        </div>
      </div>
      <div className="mt-8">
        <table className="min-w-full border-separate border-spacing-y-4">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className=" px-3 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {row.getIsExpanded() && (
                  <tr className="bg-slate-300 text-center">
                    <td colSpan={columns.length} className="text-black">
                      <div className="flex justify-between text-black px-4 py-3">
                        {expandedData.map((item, index) => (
                          <div key={index}>
                            <p className="text-sm opacity-70 font-bold">
                              {item.label}
                            </p>
                            <p className="text-lg">{item.value}</p>
                          </div>
                        ))}

                        <div className="flex gap-3">
                          <img
                            src={editIcon}
                            className="w-5 h-5 cursor-pointer"
                            alt="Edit"
                          />
                          <img
                            src={deleteIcon}
                            className="w-5 h-5 cursor-pointer"
                            alt="Delete"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {isAddBookDialogOpen && (
        <AddBook
          isOpen={isAddBookDialogOpen}
          onClose={handleCloseAddBookDialog}
          onSubmit={handleAddBookSubmit}
        />
      )}
    </div>
  );
};

export default BookManagementContent;
