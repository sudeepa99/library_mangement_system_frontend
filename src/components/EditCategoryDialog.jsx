import React, { useEffect, useState } from "react";
import { categoryApi } from "../api/categories";
import { toast } from "react-toastify";

const EditCategoryDialog = ({ isOpen, onClose, category, refresh }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  if (!isOpen || !category) return null;

  const handleUpdate = async () => {
    try {
      await categoryApi.updateCategory(category._id, { name });
      toast.success("Category updated");
      refresh();
      onClose();
    } catch {
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Category</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-md hover:bg-gray-50 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryDialog;
