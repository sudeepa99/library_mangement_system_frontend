import { useEffect, useState } from "react";

import { bookApi } from "../api/books";

import DialogBox from "./DialogBox";

const EditBook = ({ isOpen, onClose, bookData, refreshBooks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isOpen && bookData) {
      setInitialData({
        title: bookData.title || "",
        author: bookData.author || "",
        isbn: bookData.isbn || "",
        category: bookData.category || "",
        publishedYear: bookData.publishedYear?.toString() || "",
        publisher: bookData.publisher || "",
        numberOfCopies: bookData.copies?.toString() || "",
        availableCopies: bookData.availableCopies?.toString() || "",
      });
    }
  }, [isOpen, bookData]);

  const handleSubmit = async (formData) => {
    if (!bookData?._id) {
      setError("No book selected for editing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedBookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || "",
        category: formData.category,
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : null,
        publisher: formData.publisher || "",
        copies: parseInt(formData.numberOfCopies),
        availableCopies: parseInt(formData.availableCopies),
      };

      const response = await bookApi.updateBook(bookData._id, updatedBookData);
      console.log("Book updated successfully:", response);

      onClose();

      if (refreshBooks) {
        refreshBooks();
      }
    } catch (err) {
      console.error("Error updating book:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update book. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setError(null);
  };

  if (!isOpen) return null;
  return (
    <div>
      <DialogBox
        DialogTitle="Edit Book"
        submitButtonName={isLoading ? "Updating..." : "Update"}
        isOpen={isOpen}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
        initialData={initialData}
      />
    </div>
  );
};

export default EditBook;
