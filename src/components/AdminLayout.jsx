// src/components/AdminLayout.jsx
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AdminLayout() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div>
      <AdminSidebar />
      <div>
        <main className="admin-main" >
          <Outlet />
        </main>
      </div>
    </div>
  );
}


