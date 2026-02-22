import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { authApi } from "../api/auth";
import { borrowingApi } from "../api/borrowings";

import PageLoader from "./PageLoader";

const MyBorrowingContent = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [preModalLoading, setPreModalLoading] = useState(false);

  const fetchUserAndBorrowings = async () => {
    try {
      setLoading(true);
      const userRes = await authApi.getMe();
      setCurrentUser(userRes.data);

      const borrowingsRes = await borrowingApi.getuserBorrowings(
        userRes.data._id,
      );

      setBorrowings(borrowingsRes.data);
    } catch (error) {
      toast.error("Failed to fetch borrowings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndBorrowings();
  }, []);

  const handleReturnClick = (borrowing) => {
    setSelectedBorrowing(borrowing);
    setPreModalLoading(true);

    setTimeout(() => {
      setPreModalLoading(false);
      setShowReturnModal(true);
    }, 1500);
  };

  const handleReturnBook = async () => {
    if (!selectedBorrowing) return;

    try {
      setReturningBookId(selectedBorrowing._id);
      console.log("id", selectedBorrowing._id);
      const response = await borrowingApi.returnBook(selectedBorrowing._id);

      console.log("cnsjsjj", response);

      toast.success(response.message || "Book returned successfully!");

      await fetchUserAndBorrowings();

      setShowReturnModal(false);
      setSelectedBorrowing(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to return book");
    } finally {
      setReturningBookId(null);
    }
  };

  const calculatePotentialFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (today <= due) return 0;

    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 1;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "borrowed":
        return "bg-blue-100 text-blue-700";
      case "returned":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <PageLoader />;

  return (
    <div className="h-full flex flex-col p-8">
      {preModalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">Preparing...</p>
          </div>
        </div>
      )}

      {showReturnModal && selectedBorrowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Return Book?
                </h3>
                <p className="text-sm text-gray-500">Confirm book return</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">
                {selectedBorrowing.book.title}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                by {selectedBorrowing.book.author}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Borrowed:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedBorrowing.borrowedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedBorrowing.dueDate)}
                  </span>
                </div>

                {calculatePotentialFine(selectedBorrowing.dueDate) > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-red-600 font-medium">
                      Overdue Fine:
                    </span>
                    <span className="font-bold text-red-600">
                      $
                      {calculatePotentialFine(
                        selectedBorrowing.dueDate,
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {calculatePotentialFine(selectedBorrowing.dueDate) > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Note:</strong> This book is overdue. A fine of $
                  {calculatePotentialFine(selectedBorrowing.dueDate).toFixed(2)}{" "}
                  will be applied.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedBorrowing(null);
                }}
                disabled={returningBookId}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnBook}
                disabled={returningBookId}
                className="flex-1 px-4 py-3 bg-[#009B4D] text-white rounded-lg font-medium hover:bg-[#00843f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {returningBookId ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circleborrowed
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circleborrowed>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Returning...
                  </>
                ) : (
                  "Confirm Return"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-shrink-0">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">My Borrowings</h1>
          <p className="text-gray-600 mt-2">
            Track all your borrowed books and their due dates
          </p>
        </div>
      </div>
      {borrowings.length > 0 && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Borrowed
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {borrowings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Currently Borrowed
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {borrowings.filter((b) => b.status === "Borrowed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scrollbar-thumb-[#00843f] ">
        {borrowings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Borrowings Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't borrowed any books yet. Visit the catalogue to start
              borrowing!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {borrowings.map((borrowing) => {
              const daysRemaining = calculateDaysRemaining(borrowing.dueDate);
              const isOverdue = daysRemaining < 0;
              const isDueSoon = daysRemaining >= 0 && daysRemaining <= 3;

              return (
                <div
                  key={borrowing._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">
                            {borrowing.book.title.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            {borrowing.book.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            by {borrowing.book.author}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-gray-600">
                                Borrowed: {formatDate(borrowing.borrowedDate)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg
                                className={`w-4 h-4 ${
                                  isOverdue
                                    ? "text-red-500"
                                    : isDueSoon
                                      ? "text-orange-500"
                                      : "text-gray-400"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span
                                className={`font-medium ${
                                  isOverdue
                                    ? "text-red-600"
                                    : isDueSoon
                                      ? "text-orange-600"
                                      : "text-gray-600"
                                }`}
                              >
                                Due: {formatDate(borrowing.dueDate)}
                              </span>
                            </div>
                          </div>

                          {borrowing.status === "Borrowed" && (
                            <div className="mt-3 flex items-center gap-3 flex-wrap">
                              {isOverdue ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Overdue by {Math.abs(daysRemaining)} day
                                  {Math.abs(daysRemaining) !== 1 ? "s" : ""}
                                </div>
                              ) : isDueSoon ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Due in {daysRemaining} day
                                  {daysRemaining !== 1 ? "s" : ""}
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {daysRemaining} day
                                  {daysRemaining !== 1 ? "s" : ""} remaining
                                </div>
                              )}

                              <button
                                onClick={() => handleReturnClick(borrowing)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#009B4D] text-white rounded-full text-sm font-medium hover:bg-[#00843f] transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                Return Book
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          borrowing.status,
                        )}`}
                      >
                        {borrowing.status.charAt(0).toUpperCase() +
                          borrowing.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {borrowing.status === "returned" &&
                    borrowing.returnedDate && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            Returned on {formatDate(borrowing.returnedDate)}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBorrowingContent;
