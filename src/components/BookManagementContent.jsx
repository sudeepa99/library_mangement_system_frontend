const BookManagementContent = () => {
  return (
    <div className="px-[4%] py-[2%]">
      <div className="flex flex-1 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>
        <div className="bg-green-600 rounded-md">
          <button className=" px-3 py-2 text-center text-white">
            Add New Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookManagementContent;
