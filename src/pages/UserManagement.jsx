import AdminLayout from "../components/AdminLayout";
import UserManagementContent from "../components/UserMangementContent";

const UserManagement = () => {
  return (
    <div>
      <AdminLayout>
        <UserManagementContent />
      </AdminLayout>
    </div>
  );
};

export default UserManagement;
