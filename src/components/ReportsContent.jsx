import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Download,
  FileText,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";
import { borrowingApi } from "../api/borrowings";
import { bookApi } from "../api/books";
import PageLoader from "./PageLoader";

const ReportContent = () => {
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 11))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      const booksResponse = await bookApi.getBooks();
      const borrowingsResponse = await borrowingApi.getBorrowings();
      console.log("boroow", borrowingsResponse);

      setBooks(booksResponse.data?.data || []);
      setBorrowings(borrowingsResponse.data?.data || []);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  const borrowingTrends = useMemo(() => {
    const trends = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();

      trends.push({
        month: `${monthName} ${year}`,
        borrowings: 0,
        returns: 0,
      });
    }

    borrowings.forEach((borrowing) => {
      if (borrowing.borrowedDate) {
        const borrowDate = new Date(borrowing.borrowedDate);
        const monthYear = borrowDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const trend = trends.find((t) => t.month === monthYear);
        if (trend) {
          trend.borrowings++;
        }
      }

      if (borrowing.returnedDate) {
        const returnDate = new Date(borrowing.returnedDate);
        const monthYear = returnDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const trend = trends.find((t) => t.month === monthYear);
        if (trend) {
          trend.returns++;
        }
      }
    });

    return trends;
  }, [borrowings]);

  const booksByCategory = useMemo(() => {
    const categoryMap = {};

    books.forEach((book) => {
      const category = book.category || "Uncategorized";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      count: value,
    }));
  }, [books]);

  const topBooks = useMemo(() => {
    const bookBorrowCount = {};

    borrowings.forEach((borrowing) => {
      if (borrowing.book && borrowing.book._id) {
        const bookId = borrowing.book._id;
        bookBorrowCount[bookId] = (bookBorrowCount[bookId] || 0) + 1;
      }
    });

    return Object.entries(bookBorrowCount)
      .map(([bookId, count]) => {
        const book = books.find((b) => b._id === bookId);
        return book ? { ...book, borrowCount: count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);
  }, [borrowings, books]);

  const topBorrowers = useMemo(() => {
    const userBorrowCount = {};

    borrowings.forEach((borrowing) => {
      if (borrowing.user && borrowing.user._id) {
        const userId = borrowing.user._id;
        userBorrowCount[userId] = {
          count: (userBorrowCount[userId]?.count || 0) + 1,
          user: borrowing.user,
        };
      }
    });

    return Object.values(userBorrowCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [borrowings]);

  const keyMetrics = useMemo(() => {
    const genreCount = {};
    borrowings.forEach((b) => {
      if (b.book) {
        const book = books.find((book) => book._id === b.book?._id);
        if (book && book.category) {
          genreCount[book.category] = (genreCount[book.category] || 0) + 1;
        }
      }
    });

    const mostBorrowedGenre =
      Object.entries(genreCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "None";

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const newThisMonth = books.filter((book) => {
      const createdDate = new Date(book.createdAt);
      return (
        createdDate.getMonth() === thisMonth &&
        createdDate.getFullYear() === thisYear
      );
    }).length;

    const overdueBorrowings = borrowings.filter((b) => {
      if (!b.dueDate || b.status === "Returned") return false;
      return new Date(b.dueDate) < new Date();
    });

    const totalOverdueDays = overdueBorrowings.reduce((sum, b) => {
      const dueDate = new Date(b.dueDate);
      const today = new Date();
      const diffTime = today - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, diffDays);
    }, 0);

    const avgOverdueDays =
      overdueBorrowings.length > 0
        ? (totalOverdueDays / overdueBorrowings.length).toFixed(1)
        : 0;

    return {
      totalBooks: books.length,
      totalBorrowings: borrowings.length,
      activeBorrowings: borrowings.filter((b) => b.status === "Borrowed")
        .length,
      mostBorrowedGenre,
      newThisMonth,
      avgOverdueDays,
      fictionBooks: books.filter((b) => b.category === "Fiction").length,
    };
  }, [books, borrowings]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
  };

  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className="px-[4%] py-[2%]">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Reports & Analytics
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Date Range:</span>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
            >
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Borrowing Trends (Last 12 Months)
          </h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={borrowingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="borrowings"
                name="Borrowings"
                stroke="#0088FE"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                name="Returns"
                stroke="#00C49F"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Most Borrowed Genre
              </p>
              <p className="text-lg font-bold mt-1">
                {keyMetrics.mostBorrowedGenre}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                New This Month
              </p>
              <p className="text-lg font-bold mt-1">
                {keyMetrics.newThisMonth}
              </p>
            </div>
            <div className="text-green-600 font-bold">3.2%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Fiction</p>
              <p className="text-lg font-bold mt-1">
                {keyMetrics.fictionBooks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                New Users This Month
              </p>
              <p className="text-lg font-bold mt-1">3.2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top 10 Borrowers
          </h3>

          <div className="space-y-3">
            {topBorrowers.slice(0, 5).map((borrower, index) => (
              <div
                key={borrower.user._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{borrower.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {borrower.user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{borrower.count} books</p>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Fiction Readers</p>
                  <p className="text-lg font-bold">{keyMetrics.fictionBooks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Borrows</p>
                  <p className="text-lg font-bold">
                    {topBorrowers.length > 0
                      ? (
                          topBorrowers.reduce((sum, b) => sum + b.count, 0) /
                          topBorrowers.length
                        ).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Book by Category
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={booksByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {booksByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} books`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">Top 10 Books</h4>
                <div className="space-y-2">
                  {topBooks.slice(0, 3).map((book, index) => (
                    <div
                      key={book._id}
                      className="flex justify-between text-sm"
                    >
                      <span className="truncate font-medium">
                        {index + 1}. {book.title}
                      </span>
                      <span className="font-bold text-blue-600">
                        {book.borrowCount}
                      </span>
                    </div>
                  ))}
                  {topBooks.length > 3 && (
                    <p className="text-blue-500 text-sm text-center pt-2">
                      +{topBooks.length - 3} more books
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Overdue Days</p>
                    <p className="text-xl font-bold">
                      {keyMetrics.avgOverdueDays}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
