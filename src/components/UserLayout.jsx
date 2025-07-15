// src/components/UserLayout.jsx
import UserSidebar from "./UserSidebar";
import { useUser } from "../context/UserContext";

export default function UserLayout() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div
      style={{
        minWidth: 240,
        background: "#23272f",
        height: "100vh",
        borderRight: "1.5px solid #23272f",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <UserSidebar />
    </div>
  );
}
