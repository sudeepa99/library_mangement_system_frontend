import { useState } from "react";

import { bookApi } from "../api/books";

import DialogBox from "./DialogBox";
import { toast } from "react-toastify";

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
        websiteLink: formData.websiteLink,
      };

      const response = await bookApi.addBook(bookData);
      toast.success(response.message);
      console.log(response);

      onClose();

      if (refreshBooks) {
        refreshBooks();
      }
    } catch (err) {
      console.error("Error adding book:", err);
      setError(
        err.response?.data?.message || "Failed to add book. Please try again.",
      );
      toast.error(err);
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
