// src/components/AdminLayout.jsx
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AdminLayout() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minHeight: "100vh", background: "#23272f" }}>
        <main
          className="home-main"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}


