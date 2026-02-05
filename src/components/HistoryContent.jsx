import { useEffect, useState } from "react";
import { authApi } from "../api/auth";
import { toast } from "react-toastify";
import { borrowingApi } from "../api/borrowings";
import PageLoader from "./PageLoader";

const HistoryContent = () => {
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        setLoading(true);
        const userRes = await authApi.getMe();
        setCurrentUser(userRes.data);

        const historyRes = await borrowingApi.getuserBorrowings(
          userRes.data._id,
        );
        setHistory(historyRes.data);
      } catch (error) {
        toast.error("Failed to fetch borrowing history");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateBorrowingDuration = (borrowedDate, returnedDate) => {
    const borrowed = new Date(borrowedDate);
    const returned = returnedDate ? new Date(returnedDate) : new Date();
    const diffTime = Math.abs(returned - borrowed);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and search logic
  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group by status for statistics
  const stats = {
    total: history.length,
    borrowed: history.filter((h) => h.status === "Borrowed").length,
    returned: history.filter((h) => h.status === "Returned").length,
    totalFines: history.reduce((sum, h) => sum + (h.fine || 0), 0),
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Borrowing History
        </h1>
        <p className="text-gray-600">
          Complete record of all your library transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">
                Total Books
              </p>
              <p className="text-3xl font-bold text-indigo-900">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-700"
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

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">
                Currently Borrowed
              </p>
              <p className="text-3xl font-bold text-amber-900">
                {stats.borrowed}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-700"
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
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600 mb-1">
                Returned Books
              </p>
              <p className="text-3xl font-bold text-emerald-900">
                {stats.returned}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-700"
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

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600 mb-1">
                Total Fines
              </p>
              <p className="text-3xl font-bold text-rose-900">
                ${stats.totalFines.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-rose-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by book title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="Borrowed">Currently Borrowed</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>

        {/* Active filters indicator */}
        {(filterStatus !== "all" || searchTerm !== "") && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Status: {filterStatus}
                <button
                  onClick={() => setFilterStatus("all")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
            {searchTerm !== "" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredHistory.length} of {history.length} records
        </p>
      </div>

      {/* History Table/List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Records Found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters or search terms"
              : "You haven't borrowed any books yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Borrowed Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Returned Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((record) => {
                  const duration = calculateBorrowingDuration(
                    record.borrowedDate,
                    record.returnedDate,
                  );
                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-white">
                              {record.book.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {record.book.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {record.book.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(record.borrowedDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(record.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.returnedDate ? (
                          formatDate(record.returnedDate)
                        ) : (
                          <span className="text-gray-400 italic">
                            Not returned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {duration} day{duration !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4">
                        {record.fine && record.fine > 0 ? (
                          <span className="text-sm font-semibold text-red-600">
                            ${record.fine.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "Borrowed"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredHistory.map((record) => {
              const duration = calculateBorrowingDuration(
                record.borrowedDate,
                record.returnedDate,
              );
              return (
                <div key={record._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">
                        {record.book.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {record.book.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {record.book.author}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          record.status === "Borrowed"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Borrowed:</span>
                      <span className="font-medium text-gray-700">
                        {formatDate(record.borrowedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due:</span>
                      <span className="font-medium text-gray-700">
                        {formatDate(record.dueDate)}
                      </span>
                    </div>
                    {record.returnedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Returned:</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(record.returnedDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-700">
                        {duration} day{duration !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {record.fine && record.fine > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fine:</span>
                        <span className="font-semibold text-red-600">
                          ${record.fine.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryContent;
