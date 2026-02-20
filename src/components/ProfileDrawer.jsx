import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../api/auth";

const ProfileDrawer = ({ isOpen, onClose, user, refreshUser }) => {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Name cannot be empty");
    }

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return toast.error("Please fill both password fields");
    }

    try {
      setIsLoading(true);

      await authApi.updateMe({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      toast.success("Profile updated successfully");

      refreshUser();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Update failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out  z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Update Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg text-white font-medium
                bg-gradient-to-r from-green-400 to-blue-500 
                hover:opacity-90 transition"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
