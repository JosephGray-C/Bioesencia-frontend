import React from "react";
import UserSidebar from "./UserSidebar";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function UserLayout({ children }) {
    const { user } = useUser();
    if (!user) return null;

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <UserSidebar />
            <div style={{ flex: 1, minHeight: "100vh", background: "#fff" }}>
                <main
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        boxSizing: "border-box",
                    }}
                >
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}