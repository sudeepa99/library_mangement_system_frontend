import bookIcon from "../assets/icons/book-open.png";
import availableCopiesIcon from "../assets/icons/circle-check-big.png";
import activeBorrowingsIcon from "../assets/icons/clock.png";
import overdueBooksIcon from "../assets/icons/triangle-alert.png";
import quickActionsIcon from "../assets/icons/waypoints.png";
import manageUserIcon from "../assets/icons/users-round.png";
import borrowingIcon from "../assets/icons/book-open.png";
import returnIcon from "../assets/icons/corner-down-left.png";
import addBookIcon from "../assets/icons/book-copy.png";
import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboard";
import { toast } from "react-toastify";
import PageLoader from "./PageLoader";
import { notificationApi } from "../api/notification";

const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getDashboardStats();
        setStats(data.data);
      } catch (error) {
        toast.error("Failed to load dashboard statistics");
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const res = await dashboardApi.getRecentActivity();
        setRecentActivity(res.data);
      } catch (error) {
        toast.error("Failed to load recent activity");
      }
    };

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await fetchStats();
        await fetchRecentActivity();
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  const overdueActivities = recentActivity.filter(
    (item) => item.status === "Borrowed" && new Date(item.dueDate) < new Date(),
  );

  const handleSendReminder = async (userId, bookId) => {
    try {
      await notificationApi.sendOverdueReminder(userId, bookId);
      toast.success("Reminder sent successfully");
    } catch (error) {
      toast.error("Failed to send reminder");
    }
  };

  const staticsItems = [
    {
      name: "Total Books",
      icon: bookIcon,
      value: stats?.totalBooks || 0,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      name: "Available Copies",
      icon: availableCopiesIcon,
      value: stats?.availableCopies || 0,
      color: "bg-green-50",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      name: "Active Borrowings",
      icon: activeBorrowingsIcon,
      value: stats?.activeBorrowings || 0,
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      name: "Overdue Books",
      icon: overdueBooksIcon,
      value: stats?.overdueBooks || 0,
      color: "bg-red-50",
      textColor: "text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  const buttonItems = [
    {
      name: "Add New Book",
      bgColor: "bg-[#009B4D] hover:bg-[#00843f] text-white",
      icon: addBookIcon,
    },
    {
      name: "Process Borrowing",
      bgColor: "bg-blue-100 hover:bg-blue-200 text-blue-800",
      icon: borrowingIcon,
    },
    {
      name: "Process Return",
      bgColor: "bg-[#FFCC00] hover:bg-[#e6b800] text-gray-800",
      icon: returnIcon,
    },
    {
      name: "Manage Users",
      bgColor: "bg-[#D92D20] hover:bg-[#c2261a] text-white",
      icon: manageUserIcon,
    },
  ];
  return (
    <div className="px-[4%] py-[2%] h-full overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scroll ">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {staticsItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-xl ${item.iconBg}`}>
                <img src={item.icon} alt={item.name} className="h-6 w-6" />
              </div>
            </div>

            <div className="mb-4 text-center">
              <p className="text-3xl font-bold text-gray-800 mb-2">
                {item.value}
              </p>
              <p className={`text-sm font-semibold ${item.textColor}`}>
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="mb-8 flex items-center gap-3">
          <div>
            <img
              src={quickActionsIcon}
              className="h-7 w-7"
              alt="Quick Actions"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buttonItems.map((item, index) => (
            <button
              key={index}
              className={`${item.bgColor} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 w-full text-center font-medium flex flex-col items-center justify-center min-h-[120px] transform hover:-translate-y-1`}
            >
              <img
                src={item.icon}
                className="h-6 w-6 mb-3"
                alt="quick action icons"
              />
              <span className="font-semibold">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            {/* <button className="text-sm text-[#009B4D] hover:text-[#00843f] font-medium">
              View All →
            </button> */}
          </div>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">
                      {item.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.status === "Returned" ? "Returned" : "Borrowed"} "
                      {item.book.title}"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      item.status === "Returned"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      item.returnedDate || item.borrowedDate,
                    ).toLocaleDateString()}{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <img
                  src={overdueBooksIcon}
                  alt="Overdue Alerts"
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Overdue Alerts
                </h3>
                <p className="text-sm text-gray-500">
                  Requires immediate attention
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600">
              {overdueActivities.length} Urgent
            </span>
          </div>

          <div className="space-y-4">
            {overdueActivities.length > 0 ? (
              overdueActivities.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg border border-red-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        "{item.book.title}"
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        {Math.ceil(
                          (new Date() - new Date(item.dueDate)) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days overdue
                      </p>
                      <p className="text-xs text-gray-500">
                        Fine: ${item.fine}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <button
                      onClick={() =>
                        handleSendReminder(item.user._id, item.book._id)
                      }
                      className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 font-semibold">
                No overdue borrowings at the moment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
