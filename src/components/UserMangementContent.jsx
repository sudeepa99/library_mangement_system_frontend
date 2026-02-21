import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState, useEffect } from "react";

import viewMoreIcon from "../assets/icons/chevron-down.png";
import deleteIcon from "../assets/icons/trash.png";
import editIcon from "../assets/icons/pencil.png";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import { toast } from "react-toastify";
import { userApi } from "../api/user";
import PageLoader from "./PageLoader";

const UserManagementContent = () => {
  const [expanded, setExpanded] = useState({});
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [preModalLoading, setPreModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAllUsers();
      console.log(response);
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleCloseEditUserDialog = () => {
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser?._id) return;

    setDeleteLoading(true);
    try {
      await userApi.deleteUser(selectedUser._id);
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete user. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    setDeleteLoading(false);
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm]);

  const tableData = useMemo(() => {
    return filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status || "Active",
      CreatedAt: user.createdAt,
      originalData: user,
    }));
  }, [filteredUsers]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Name",
        header: "Name",
      },
      {
        accessorKey: "Email",
        header: "Email",
      },
      {
        accessorKey: "Role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.Role;
          const roleColors = {
            admin: "bg-purple-100 text-purple-800",
            librarian: "bg-blue-100 text-blue-800",
            student: "bg-green-100 text-green-800",
            faculty: "bg-yellow-100 text-yellow-800",
            user: "bg-gray-100 text-gray-800",
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                roleColors[role] || "bg-gray-100 text-gray-800"
              }`}
            >
              {role?.charAt(0).toUpperCase() + role?.slice(1) || "User"}
            </span>
          );
        },
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.Status;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-green-100 text-green-800"
                  : status === "Suspended"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "Action",
        header: "Action",
        cell: ({ row }) => {
          return (
            <div className="flex justify-center items-center gap-2">
              <img
                src={viewMoreIcon}
                alt="view more"
                className={`w-5 h-5 cursor-pointer transition-transform ${
                  row.getIsExpanded() ? "rotate-180" : ""
                }`}
                onClick={() => {
                  row.toggleExpanded();
                }}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { expanded },
    getRowId: (row) => row.originalData._id,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    enableExpanding: true,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  const openWithLoader = (callback) => {
    setPreModalLoading(true);

    setTimeout(() => {
      setPreModalLoading(false);
      callback();
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col overflow-hidden">
      {preModalLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">Preparing...</p>
          </div>
        </div>
      )}
      <div className="flex flex-shrink-0 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-4">
          <div className="bg-gray-100 rounded-md px-4 py-2">
            <span className="font-semibold">Total Users: {users.length}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-shrink-0 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1 min-h-0">
        {tableData.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No users match your search criteria."
                : "No users found."}
            </p>
          </div>
        ) : (
          <div className="h-full rounded-lg border border-gray-200 shadow overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#8C92AC] scrollbar-track-gray-200 hover:scrollbar-thumb-[#00843f]">
              <table className="min-w-full border-separate border-spacing-y-4 items-center text-center">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-center text-sm font-semibold text-gray-700"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const user = row.original.originalData;

                    return (
                      <React.Fragment key={row.id}>
                        <tr className="bg-white hover:bg-gray-50 transition-colors">
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-3 text-center border-t border-b"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>

                        {row.getIsExpanded() && (
                          <tr className="bg-gray-100">
                            <td colSpan={columns.length} className="px-4 py-4">
                              <div className="flex justify-between items-center">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                                  <div>
                                    <p className="text-sm text-gray-500 font-medium">
                                      User ID
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {user._id?.substring(0, 8)}...
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-medium">
                                      Registration Date
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {formatDate(user.createdAt)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-medium">
                                      Phone
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {user.phone || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-medium">
                                      Active Borrowings
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {user.activeBorrowings?.length || 0}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-3 ml-4">
                                  <button
                                    onClick={() =>
                                      openWithLoader(() => handleEditUser(user))
                                    }
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Edit User"
                                  >
                                    <img
                                      src={editIcon}
                                      alt="Edit"
                                      className="w-5 h-5"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openWithLoader(() =>
                                        handleDeleteClick(user),
                                      )
                                    }
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Delete User"
                                  >
                                    <img
                                      src={deleteIcon}
                                      alt="Delete"
                                      className="w-5 h-5"
                                    />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <EditUser
        isOpen={isEditUserDialogOpen}
        onClose={handleCloseEditUserDialog}
        userData={selectedUser}
        refreshUsers={fetchUsers}
      />
      <DeleteUser
        isOpen={isDeleteUserDialogOpen}
        onClose={handleCloseDeleteDialog}
        userData={selectedUser}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default UserManagementContent;
