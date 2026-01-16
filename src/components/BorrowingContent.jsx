import { useEffect, useState } from "react";
import { borrowingApi } from "../api/borrowings";

const BorrowingContent = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingApi.getBorrowings();
      setBorrowings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch borrowings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBorrowings = borrowings.filter((borrowing) => {
    switch (activeTab) {
      case "active":
        return borrowing.status === "Borrowed" || borrowing.status === "Active";
      case "overdue":
        return (
          new Date(borrowing.dueDate) < new Date() &&
          (borrowing.status === "Borrowed" || borrowing.status === "Active")
        );
      case "returned":
        return borrowing.status === "Returned";
      default:
        return true;
    }
  });

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateFine = (dueDate) => {
    const overdueDays = calculateOverdueDays(dueDate);
    return overdueDays * 1; // $1 per day
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderTable = () => {
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error)
      return <div className="p-4 text-center text-red-500">{error}</div>;
    if (filteredBorrowings.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
          No {activeTab === "active" ? "active borrowings" : activeTab} found
        </div>
      );
    }

    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg px-[4%] py-[2%]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab === "active" && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Remaining
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </>
              )}

              {activeTab === "overdue" && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overdue Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine Amount
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </>
              )}

              {activeTab === "returned" && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Returned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine Paid
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBorrowings.map((borrowing) => (
              <tr key={borrowing._id} className="hover:bg-gray-50">
                {/* Active Borrowings */}
                {activeTab === "active" && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.borrowedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          calculateOverdueDays(borrowing.dueDate) > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {calculateOverdueDays(borrowing.dueDate) > 0
                          ? `Overdue by ${calculateOverdueDays(
                              borrowing.dueDate
                            )} days`
                          : "On time"}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Renew
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Return
                      </button>
                    </td> */}
                  </>
                )}

                {/* Overdue Borrowings */}
                {activeTab === "overdue" && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {calculateOverdueDays(borrowing.dueDate)} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${calculateFine(borrowing.dueDate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Return
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        Charge Fine
                      </button>
                    </td>
                  </>
                )}

                {/* Returned Borrowings */}
                {activeTab === "returned" && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.borrowedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(borrowing.returnedDate || borrowing.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          borrowing.fine > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        ${borrowing.fine ? borrowing.fine.toFixed(2) : "0.00"}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Borrowing Management
      </h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "active"
              ? "bg-blue-500 text-white shadow-md"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Active Borrowings (
          {borrowings.filter((b) => b.status === "Borrowed").length})
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "overdue"
              ? "bg-red-500 text-white shadow-md"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Overdue (
          {
            borrowings.filter(
              (b) =>
                new Date(b.dueDate) < new Date() &&
                (b.status === "Borrowed" || b.status === "Active")
            ).length
          }
          )
        </button>

        <button
          onClick={() => setActiveTab("returned")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "returned"
              ? "bg-green-500 text-white shadow-md"
              : "border border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Returned ({borrowings.filter((b) => b.status === "Returned").length})
        </button>
      </div>

      {renderTable()}
    </div>
  );
};

export default BorrowingContent;
