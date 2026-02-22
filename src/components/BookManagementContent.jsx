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
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook";
import { toast } from "react-toastify";
import PageLoader from "./PageLoader";

const BookManagementContent = () => {
  const [expanded, setExpanded] = useState({});
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] = useState(false);
  const [isDeleteBookDialogOpen, setIsDeleteBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preModalLoading, setPreModalLoading] = useState(false);

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
      toast.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book) => {
    setPreModalLoading(true);

    setTimeout(() => {
      setSelectedBook(book);
      setPreModalLoading(false);
      setIsEditBookDialogOpen(true);
    }, 1500);
  };

  const handleCloseEditBookDialog = () => {
    setIsEditBookDialogOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteClick = (book) => {
    setPreModalLoading(true);

    setTimeout(() => {
      setSelectedBook(book);
      setPreModalLoading(false);
      setIsDeleteBookDialogOpen(true);
    }, 1500);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook?._id) return;

    setDeleteLoading(true);
    try {
      await bookApi.deleteBook(selectedBook._id);

      setIsDeleteBookDialogOpen(false);
      setSelectedBook(null);

      fetchBooks();

      toast.success("Book deleted successfully!");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteBookDialogOpen(false);
    setSelectedBook(null);
    setDeleteLoading(false);
  };

  const tableData = useMemo(() => {
    return books.map((book) => ({
      // ID: book._id,
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
        accessorKey: "ISBN",
        header: "ISBN",
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
    [],
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpenAddBookDialog = () => {
    setPreModalLoading(true);

    setTimeout(() => {
      setPreModalLoading(false);
      setIsAddBookDialogOpen(true);
    }, 1500);
  };

  const handleCloseAddBookDialog = () => {
    setIsAddBookDialogOpen(false);
  };

  if (loading) {
    return <PageLoader />;
  }

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
          <div className="h-full overflow-y-auto max-h-96 rounded-lg scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scrollbar-thumb-[#00843f]">
            <table className="min-w-full border-separate border-spacing-y-4 items-center text-center ">
              <thead className="sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-center text-sm font-semibold text-gray-700"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                              cell.getContext(),
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
                                  onClick={() => handleDeleteClick(book)}
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
          </div>
        )}
        {preModalLoading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-800 font-medium">Preparing...</p>
            </div>
          </div>
        )}
      </div>

      <AddBook
        isOpen={isAddBookDialogOpen}
        onClose={handleCloseAddBookDialog}
        refreshBooks={fetchBooks}
      />

      <EditBook
        isOpen={isEditBookDialogOpen}
        onClose={handleCloseEditBookDialog}
        bookData={selectedBook}
        refreshBooks={fetchBooks}
      />

      <DeleteBook
        isOpen={isDeleteBookDialogOpen}
        onClose={handleCloseDeleteDialog}
        bookData={selectedBook}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default BookManagementContent;
