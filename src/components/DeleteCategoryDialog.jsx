import React from "react";
import { categoryApi } from "../api/categories";
import { toast } from "react-toastify";

const DeleteCategoryDialog = ({ isOpen, onClose, category, refresh }) => {
  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    try {
      await categoryApi.deleteCategory(category._id);
      toast.success("Category deleted");
      refresh();
      onClose();
    } catch {
      toast.error("Cannot delete category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Delete Category</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{category.name}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryDialog;
