import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLoader from "./PageLoader";

import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import editIcon from "../assets/icons/pencil.png";
import deleteIcon from "../assets/icons/trash.png";
import { categoryApi } from "../api/categories";

const CategoryManagementContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [preModalLoading, setPreModalLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const openWithLoader = (callback) => {
    setPreModalLoading(true);

    setTimeout(() => {
      setPreModalLoading(false);
      callback();
    }, 1000);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="px-[4%] py-[2%]">
      {/* Header */}
      {preModalLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">Preparing...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl lg:text-2xl  font-bold text-gray-800">
          Category Management
        </h2>

        <button
          onClick={() => openWithLoader(() => setAddOpen(true))}
          className="px-2 py-1 md:px-4 md:py-2   bg-green-600 text-white rounded-md hover:bg-green-700 transition font-bold "
        >
          Add Category
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="mt-10 text-center border-2 border-dashed border-gray-300 rounded-lg py-12">
          <p className="text-gray-500 text-sm md:text-lg ">
            No categories available
          </p>
          <button
            onClick={() => openWithLoader(() => setAddOpen(true))}
            className="mt-4 px-2 py-1 md:px-4 md:py-2  bg-blue-600 text-white rounded"
          >
            Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-sm md:text-lg font-semibold text-gray-800">
                  {category.name}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    openWithLoader(() => {
                      setSelectedCategory(category);
                      setEditOpen(true);
                    })
                  }
                  className="flex items-center justify-center 
             w-8 h-8 sm:w-10 sm:h-10 
             bg-blue-100 rounded-lg 
             hover:bg-blue-200 active:scale-95 
             transition"
                >
                  <img
                    src={editIcon}
                    alt="Edit"
                    className="w-2 h-2 md:w-4 md:h-4"
                  />
                </button>

                <button
                  onClick={() =>
                    openWithLoader(() => {
                      setSelectedCategory(category);
                      setDeleteOpen(true);
                    })
                  }
                  className="flex items-center justify-center 
             w-8 h-8 sm:w-10 sm:h-10 
             bg-red-100 rounded-lg 
             hover:bg-red-200 active:scale-95 
             transition"
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="w-2 h-2 md:w-4 md:h-4"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddCategoryDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        refresh={fetchCategories}
      />

      <EditCategoryDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        category={selectedCategory}
        refresh={fetchCategories}
      />

      <DeleteCategoryDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        category={selectedCategory}
        refresh={fetchCategories}
      />
    </div>
  );
};

export default CategoryManagementContent;
