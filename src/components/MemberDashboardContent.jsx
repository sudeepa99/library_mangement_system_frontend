import { useEffect, useState } from "react";
import { authApi } from "../api/auth";
import { toast } from "react-toastify";
import { bookApi } from "../api/books";
import { borrowingApi } from "../api/borrowings";
import PageLoader from "./PageLoader";

const MemberDashboardContent = () => {
  const [userRole, setUserRole] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [preModalLoading, setPreModalLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await authApi.getMe();
        setUserRole(res.data.role);
        setCurrentUser(res.data);
      } catch {
        setUserRole(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // useEffect(() => {
  //   if (userRole === "member") {
  //     const fetchBooks = async () => {
  //       try {
  //         setLoading(true);
  //         const res = await bookApi.getBooks();
  //         setBooks(res.data);
  //       } catch {
  //         toast.error("Failed to fetch books");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchBooks();
  //   }
  // }, [userRole]);
  const fetchBooks = async () => {
    try {
      const res = await bookApi.getBooks();
      setBooks(res.data);
    } catch {
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    if (userRole !== "member") return;

    setLoading(true);
    fetchBooks().finally(() => setLoading(false));

    const intervalId = setInterval(() => {
      fetchBooks();
    }, 10000);

    return () => clearInterval(intervalId);
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
      toast.error(error?.response?.data?.error);
    }
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook) return;

    try {
      setBorrowLoading(true);
      await createBorrowing(selectedBook._id);
      setShowConfirmModal(false);
      setSelectedBook(null);
    } finally {
      setBorrowLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="h-full flex flex-col px-[4%] py-[2%]">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Books Catalogue
        </h2>
      </div>
      <div className="flex-1 px-4 overflow-y-auto  scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scrollbar-thumb-[#00843f]   ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const isAvailable = book.availableCopies > 0;

            return (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-sm flex flex-col p-5 border-gray-400 border-2 transition-all duration-300 ease-out
              hover:scale-103 hover:-translate-y-1 hover:shadow-xl"
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
                    onClick={() => {
                      setSelectedBook(book);
                      setPreModalLoading(true);

                      setTimeout(() => {
                        setPreModalLoading(false);
                        setShowConfirmModal(true);
                      }, 1500);
                    }}
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
                    className="w-full py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-300"
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
      {preModalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">Preparing...</p>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Borrow
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to borrow{" "}
              <span className="font-medium text-gray-800">
                {selectedBook?.title}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBorrow}
                disabled={borrowLoading}
                className="px-4 py-2 rounded-md bg-[#009B4D] text-white text-sm font-medium hover:bg-[#00843f] transition disabled:opacity-50"
              >
                {borrowLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboardContent;
