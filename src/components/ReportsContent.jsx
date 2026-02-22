import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Calendar, TrendingUp, BookOpen, Users, Clock } from "lucide-react";

import { borrowingApi } from "../api/borrowings";
import { bookApi } from "../api/books";
import { reportsApi } from "../api/reports";

import PageLoader from "./PageLoader";

const ReportContent = () => {
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingTrends, setBorrowingTrends] = useState([]);
  const [period, setPeriod] = useState("12M");
  const [trendLoading, setTrendLoading] = useState(false);
  const [keyMetrics, setKeyMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

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

      setBooks(booksResponse.data?.data || []);
      setBorrowings(borrowingsResponse.data?.data || []);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowingTrends();
  }, [dateRange]);

  const fetchBorrowingTrends = async () => {
    const MIN_LOADING_TIME = 800;
    const startTime = Date.now();

    try {
      setTrendLoading(true);

      const response = await reportsApi.getBorrowingTrends({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      setBorrowingTrends(response.data);
    } catch (error) {
      console.error("Error fetching borrowing trends:", error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          setTrendLoading(false);
        }, remainingTime);
      } else {
        setTrendLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchKeyMetrics();
  }, []);

  const fetchKeyMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const response = await reportsApi.getKeyMetrics();
      const metrics = response.data;

      setKeyMetrics({
        mostBorrowedGenre: metrics.mostBorrowedGenre ?? "N/A",
        newThisMonth: metrics.newThisMonth ?? 0,
        fictionBooks: metrics.fictionBooks ?? 0,
        avgOverdueDays: metrics.avgOverdueDays ?? 0,
      });
    } catch (error) {
      console.error("Error fetching key metrics:", error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await reportsApi.getAnalyticsReport();
        setAnalytics(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handlePresetChange = (months, label) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    setPeriod(label);

    setDateRange({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
      {Icon && <Icon className="w-10 h-10 mb-3 opacity-60" />}
      <p className="font-semibold text-gray-600">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="px-[4%] py-[2%] flex flex-col gap-4">
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
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Period:</span>

              {[
                { label: "3M", value: 3 },
                { label: "6M", value: 6 },
                { label: "12M", value: 12 },
                { label: "24M", value: 24 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handlePresetChange(item.value, item.label)}
                  className={`px-3 py-1 text-sm rounded-md border 
        ${
          period === item.label
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
        }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Custom:</span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => {
                  setPeriod("Custom");
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }));
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => {
                  setPeriod("Custom");
                  setDateRange((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }));
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Borrowing Trends ({period})
          </h3>
        </div>

        <div className="h-72 relative">
          {trendLoading && (
            <div className="absolute inset-0 px-24 py-10 space-y-2 animate-pulse bg-white/70 ">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={borrowingTrends}>
              <defs>
                <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="borrowings"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBorrow)"
              />

              <Area
                type="monotone"
                dataKey="returns"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorReturn)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingMetrics || !keyMetrics ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Most Borrowed Genre
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {keyMetrics.mostBorrowedGenre ?? "N/A"}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Monthly Book Additions
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {keyMetrics.newThisMonth ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fiction</p>
                  <p className="text-lg font-bold mt-1">
                    {keyMetrics.fictionBooks ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Avg. Overdue Days
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {keyMetrics.avgOverdueDays ?? "N/A"}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loadingAnalytics || !analytics ? (
          Array(2)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Top Borrowers
              </h3>

              <div className="space-y-4">
                {analytics.topBorrowers.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No Borrowing Data"
                    description="No users have borrowed books yet."
                  />
                ) : (
                  <>
                    {analytics.topBorrowers
                      .slice(0, 5)
                      .map((borrower, index) => (
                        <div
                          key={borrower._id}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                              {index + 1}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {borrower.user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {borrower.user.email}
                              </p>
                            </div>
                          </div>

                          <span className="text-blue-600 font-bold">
                            {borrower.count} books
                          </span>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Books by Category
              </h3>

              <div className="h-72">
                {analytics.booksByCategory.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No Books Available"
                    description="No books have been added to the library yet."
                  />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.booksByCategory}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                        >
                          {analytics.booksByCategory.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={`hsl(${index * 65}, 70%, 55%)`}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value) => [`${value} books`, "Count"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Most Borrowed Books
                </h4>

                <div className="space-y-2">
                  {analytics.topBooks.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="No Borrowed Books"
                      description="Books have not been borrowed yet."
                    />
                  ) : (
                    <>
                      {analytics.topBooks.slice(0, 3).map((book, index) => (
                        <div
                          key={book._id}
                          className="flex justify-between text-sm"
                        >
                          <span className="truncate font-medium">
                            {index + 1}. {book.title}
                          </span>
                          <span className="text-indigo-600 font-bold">
                            {book.borrowCount}
                          </span>
                        </div>
                      ))}

                      {analytics.topBooks.length > 3 && (
                        <p className="text-center text-xs text-gray-500 pt-2">
                          +{analytics.topBooks.length - 3} more books
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportContent;
