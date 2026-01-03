import bookIcon from "../assets/icons/book-open.png";
import availableCopiesIcon from "../assets/icons/circle-check-big.png";
import activeBorrowingsIcon from "../assets/icons/clock.png";
import overdueBooksIcon from "../assets/icons/triangle-alert.png";
import quickActionsIcon from "../assets/icons/waypoints.png";
import manageUserIcon from "../assets/icons/users-round.png";
import borrowingIcon from "../assets/icons/book-open.png";
import returnIcon from "../assets/icons/corner-down-left.png";
import addBookIcon from "../assets/icons/book-copy.png";

const AdminDashboardContent = () => {
  const staticsItems = [
    {
      name: "Total Books",
      icon: bookIcon,
      value: "3000+",
      color: "bg-blue-50",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "+12.5%",
      trendText: "Increased from last month",
    },
    {
      name: "Available Copies",
      icon: availableCopiesIcon,
      value: "2300+",
      color: "bg-green-50",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "+8.2%",
      trendText: "Increased from last month",
    },
    {
      name: "Active Borrowings",
      icon: activeBorrowingsIcon,
      value: "300",
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      trend: "+15.3%",
      trendText: "Increased from last month",
    },
    {
      name: "Overdue Books",
      icon: overdueBooksIcon,
      value: "18",
      color: "bg-red-50",
      textColor: "text-red-600",
      iconBg: "bg-red-100",
      trend: "-5.2%",
      trendText: "Decreased from last month",
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
    <div className="px-[4%] py-[2%]">
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
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${item.iconBg} ${item.textColor}`}
              >
                {item.trend}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-800 mb-2 text-center">
                {item.value}
              </p>
              <p
                className={`text-sm font-semibold ${item.textColor} text-center`}
              >
                {item.name}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-xs text-gray-600">
                <span className="mr-2">📈</span>
                <span className="text-center">{item.trendText}</span>
              </div>
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
              <img src={item.icon} className="h-6 w-6 mb-3"  />
              <span className="font-semibold">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-[#009B4D] hover:text-[#00843f] font-medium">
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">
                      Borrowed "The Great Gatsby"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-red-600 text-lg">⚠️</span>
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
              {buttonItems.length} Urgent
            </span>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg border border-red-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Jane Smith</p>
                    <p className="text-sm text-gray-600">
                      "1984" by George Orwell
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      5 days overdue
                    </p>
                    <p className="text-xs text-gray-500">Fine: $5.00</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-red-100">
                  <button className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Send Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
