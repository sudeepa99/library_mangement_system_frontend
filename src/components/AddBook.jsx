import { useState } from "react";
import DialogBox from "./DialogBox";
import { bookApi } from "../api/books";

const AddBook = ({ isOpen, onClose, refreshBooks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || "",
        category: formData.category,
        publishedYear: parseInt(formData.publishedYear) || null,
        publisher: formData.publisher || "",
        copies: parseInt(formData.numberOfCopies),
        availableCopies: parseInt(formData.availableCopies),
      };

      const response = await bookApi.addBook(bookData);
      console.log("Book added successfully:", response);

      onClose();

      if (refreshBooks) {
        refreshBooks();
      }
    } catch (err) {
      console.error("Error adding book:", err);
      setError(
        err.response?.data?.message || "Failed to add book. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <DialogBox
        DialogTitle="Add Book"
        submitButtonName={isLoading ? "Adding..." : "Add"}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AddBook;
