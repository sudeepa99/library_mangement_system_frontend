import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState, useEffect } from "react";

import viewMoreIcon from "../assets/icons/chevron-down.png";
import deleteIcon from "../assets/icons/trash.png";
import editIcon from "../assets/icons/pencil.png";
import AddBook from "./AddBook";
import { bookApi } from "../api/books";

const BookManagementContent = () => {
  const [expanded, setExpanded] = useState({});
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookApi.getBooks();
      setBooks(response.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    return books.map((book) => ({
      ID: book._id,
      Title: book.title,
      Author: book.author,
      Category: book.category,
      Copies: book.copies,
      AvailableCopies: book.availableCopies,
      PublishedYear: book.publishedYear,
      ISBN: book.isbn,
      Publisher: book.publisher,
      CreatedAt: book.createdAt,
      originalData: book,
    }));
  }, [books]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "ID",
        header: "ID",
        cell: ({ row }) => (
          <span className="truncate max-w-[100px] inline-block">
            {row.original.ID.substring(0, 8)}...
          </span>
        ),
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
        header: "Total Copies",
      },
      // {
      //   accessorKey: "AvailableCopies",
      //   header: "Available",
      // },
      {
        accessorKey: "PublishedYear",
        header: "Published Year",
      },
      {
        accessorKey: "Action",
        header: "Action",
        cell: ({ row }) => {
          return (
            <div className="flex justify-center items-center gap-2">
              <img
                src={viewMoreIcon}
                alt="view more"
                className={`w-5 h-5 cursor-pointer transition-transform ${
                  row.getIsExpanded() ? "rotate-180" : ""
                }`}
                onClick={() => {
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
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { expanded },
    getRowId: (row) => row.ID,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    enableExpanding: true,
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle book deletion
  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookApi.deleteBook(bookId);
        // Refresh the book list
        fetchBooks();
      } catch (err) {
        console.error("Error deleting book:", err);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  // Handle book edit (you'll need to implement this)
  const handleEditBook = (book) => {
    console.log("Edit book:", book);
    // You can implement edit functionality here
  };

  // Function to open the dialog
  const handleOpenAddBookDialog = () => {
    setIsAddBookDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseAddBookDialog = () => {
    setIsAddBookDialogOpen(false);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="px-[4%] py-[2%] flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="px-[4%] py-[2%]">
        <div className="flex flex-1 justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>
          <div className="bg-green-600 rounded-md">
            <button
              className="px-3 py-2 text-center text-white"
              onClick={handleOpenAddBookDialog}
            >
              Add New Book
            </button>
          </div>
        </div>
        {/* <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchBooks}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div> */}
      </div>
    );
  }

  return (
    <div className="px-[4%] py-[2%] ">
      <div className="flex flex-1 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>
        <div className="flex gap-4">
          <div className="bg-gray-100 rounded-md px-4 py-2">
            <span className="font-semibold">Total Books: {books.length}</span>
          </div>
          <div className="bg-green-600 rounded-md">
            <button
              className="px-3 py-2 text-center text-white"
              onClick={handleOpenAddBookDialog}
            >
              Add New Book
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {tableData.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg">No books found.</p>
            <button
              onClick={handleOpenAddBookDialog}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <table className="min-w-full border-separate border-spacing-y-4 items-center text-center ">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-700"
                    >
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
              {table.getRowModel().rows.map((row) => {
                const book = row.original.originalData;

                return (
                  <React.Fragment key={row.id}>
                    <tr className="bg-white hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-center border-t border-b"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && (
                      <tr className="bg-gray-100">
                        <td colSpan={columns.length} className="px-4 py-4">
                          <div className="flex justify-between items-center">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                              <div>
                                <p className="text-sm text-gray-500 font-medium">
                                  ISBN
                                </p>
                                <p className="text-lg font-semibold">
                                  {book.isbn || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 font-medium">
                                  Publisher
                                </p>
                                <p className="text-lg font-semibold">
                                  {book.publisher || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">
                                  Available Copies
                                </p>
                                <p className="text-lg font-semibold">
                                  {book.availableCopies || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 font-medium">
                                  Added Date
                                </p>
                                <p className="text-lg font-semibold">
                                  {formatDate(book.createdAt)}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 font-medium">
                                  Availability
                                </p>
                                <p className="text-lg font-semibold">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      book.availableCopies > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {book.availableCopies > 0
                                      ? "Available"
                                      : "Out of Stock"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3 ml-4">
                              <button
                                onClick={() => handleEditBook(book)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Edit Book"
                              >
                                <img
                                  src={editIcon}
                                  alt="Edit"
                                  className="w-5 h-5"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete Book"
                              >
                                <img
                                  src={deleteIcon}
                                  alt="Delete"
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Book Dialog */}
      <AddBook
        isOpen={isAddBookDialogOpen}
        onClose={handleCloseAddBookDialog}
        refreshBooks={fetchBooks}
      />
    </div>
  );
};

export default BookManagementContent;
