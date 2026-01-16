import { useEffect, useState } from "react";
import { authApi } from "../api/auth";
import { toast } from "react-toastify";
import { bookApi } from "../api/books";
import { borrowingApi } from "../api/borrowings";

const MemberDashboardContent = () => {
  const [userRole, setUserRole] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.getMe();
        setUserRole(res.data.role);
        setCurrentUser(res.data);
      } catch {
        setUserRole(null);
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userRole === "member") {
      const fetchBooks = async () => {
        try {
          const res = await bookApi.getBooks();
          setBooks(res.data);
        } catch {
          toast.error("Failed to fetch books");
        }
      };
      fetchBooks();
    }
  }, [userRole]);

  const createBorrowing = async (bookId) => {
    try {
      if (!currentUser?._id) {
        toast.error("User not loaded");
        return;
      }
      const payload = { user: currentUser._id, book: bookId };
      const response = await borrowingApi.createBorrowing(payload);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="px-[4%] py-[2%]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Books Catalogue</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => {
          const isAvailable = book.availableCopies > 0;

          return (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col p-5"
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  {book.title.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex-grow text-center">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {book.author}
                </p>

                <div className="mt-3">
                  {isAvailable ? (
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                      Not Available
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  disabled={!isAvailable}
                  onClick={() => createBorrowing(book._id)}
                  className={`w-full py-2 rounded-md font-medium transition
                    ${
                      isAvailable
                        ? "bg-[#009B4D] text-white hover:bg-[#00843f]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Borrow
                </button>

                <button
                  className="w-full py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                  onClick={() => window.open(book.moreInfoLink, "_blank")}
                >
                  See More
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberDashboardContent;
