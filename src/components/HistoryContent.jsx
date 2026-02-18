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

  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: history.length,
    borrowed: history.filter((h) => h.status === "Borrowed").length,
    returned: history.filter((h) => h.status === "Returned").length,
    totalFines: history.reduce((sum, h) => sum + (h.fine || 0), 0),
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Borrowing History</h1>
        <p className="text-gray-600 mt-1">
          Complete record of all your library transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
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
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 shrink-0">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by book title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="Borrowed">Currently Borrowed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        {/* Active filters indicator */}
        {(filterStatus !== "all" || searchTerm !== "") && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Status: {filterStatus}
                <button
                  onClick={() => setFilterStatus("all")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {searchTerm !== "" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  ✕
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
      <p className="text-sm text-gray-500 shrink-0">
        Showing {filteredHistory.length} of {history.length} records
      </p>

      {/* History Table/List — scrollable */}
      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <p className="text-xl font-semibold text-gray-700">
            No Records Found
          </p>
          <p className="text-gray-500 mt-1">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters or search terms"
              : "You haven't borrowed any books yet"}
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-gray-200 shadow-sm scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scrollbar-thumb-[#00843f]">
          {/* Desktop Table View */}
          <table className="hidden md:table w-full bg-white">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.map((record) => {
                const duration = calculateBorrowingDuration(
                  record.borrowedDate,
                  record.returnedDate,
                );
                return (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {record.book.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.book.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {record.book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(record.borrowedDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(record.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {record.returnedDate ? (
                        formatDate(record.returnedDate)
                      ) : (
                        <span className="text-orange-500 font-medium">
                          Not returned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {duration} day{duration !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {record.fine && record.fine > 0 ? (
                        <span className="text-red-600 font-medium">
                          ${record.fine.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500">$0.00</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === "Borrowed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 bg-white">
            {filteredHistory.map((record) => {
              const duration = calculateBorrowingDuration(
                record.borrowedDate,
                record.returnedDate,
              );
              return (
                <div key={record._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {record.book.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.book.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.book.author}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${record.status === "Borrowed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Borrowed: {formatDate(record.borrowedDate)}</p>
                    <p>Due: {formatDate(record.dueDate)}</p>
                    {record.returnedDate && (
                      <p>Returned: {formatDate(record.returnedDate)}</p>
                    )}
                    <p>
                      Duration: {duration} day{duration !== 1 ? "s" : ""}
                    </p>
                    {record.fine && record.fine > 0 && (
                      <p className="text-red-600 font-medium">
                        Fine: ${record.fine.toFixed(2)}
                      </p>
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
