import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import { toast } from "react-toastify";
import { authApi } from "../api/auth";
import { borrowingApi } from "../api/borrowings";

const MyBorrowingContent = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchUserAndBorrowings();
  }, []);

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Borrowings</h1>
        <p className="text-gray-600 mt-2">
          Track all your borrowed books and their due dates
        </p>
      </div>

      {borrowings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
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
                  {borrowings.filter((b) => b.status === "borrowed").length}
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

          {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Returned
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {borrowings.filter((b) => b.status === "returned").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-700"
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
              </div>
            </div>
          </div> */}
        </div>
      )}

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
                      {/* Book Icon/Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-white">
                          {borrowing.book.title.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Book Details */}
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

                        {/* Days Remaining Indicator */}
                        {borrowing.status === "borrowed" && (
                          <div className="mt-3">
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
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

                {/* Return Date if returned */}
                {borrowing.status === "returned" && borrowing.returnedDate && (
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
  );
};

export default MyBorrowingContent;
