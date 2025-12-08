import bookIcon from "../assets/icons/book-open.png";
import availableCopiesIcon from "../assets/icons/circle-check-big.png";
import activeBorrowingsIcon from "../assets/icons/clock.png";
import overdueBooksIcon from "../assets/icons/triangle-alert.png";
const AdminDashboardContent = () => {
  //   const staticsItems = [
  //     { name: "Total Books", icon: bookIcon, value: "3000+" },
  //     { name: "Available Copies", icon: availableCopiesIcon, value: "2300+" },
  //     { name: "Active Borrowings", icon: activeBorrowingsIcon, value: "300" },
  //     { name: "Overdue Books", icon: overdueBooksIcon, value: "18" },
  //   ];
  const staticsItems = [
    {
      name: "Total Books",
      icon: bookIcon,
      value: "3000+",
      color: "bg-blue-50",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      name: "Available Copies",
      icon: availableCopiesIcon,
      value: "2300+",
      color: "bg-green-50",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      name: "Active Borrowings",
      icon: activeBorrowingsIcon,
      value: "300",
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      name: "Overdue Books",
      icon: overdueBooksIcon,
      value: "18",
      color: "bg-red-50",
      textColor: "text-red-600",
      iconBg: "bg-red-100",
    },
  ];
  return (
    <div className="px-[4%] py-[2%] bg-yellow-100 shadow-md">
      {/* Statistics Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {staticsItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-xl p-12 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${item.iconBg}`}>
                <img src={item.icon} alt={item.name} className="h-6 w-6" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${item.iconBg} ${item.textColor}`}
              >
                +12.5%
              </span>
            </div>

            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1 text-center">
                {item.value}
              </p>
              <p
                className={`text-sm font-medium ${item.textColor} text-center`}
              >
                {item.name}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">📈</span>
                <span>Increased from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardContent;
