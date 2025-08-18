// src/components/PerfilUsuario.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function PerfilUsuario() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#fff" }}>
                <p>No has iniciado sesión.</p>
            </div>
        );
    }

    const Card = ({ children }) => (
        <div
            style={{
                width: "100%",
                maxWidth: 720,
                background: "#2b303a",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                overflow: "hidden",
                color: "#fff",
                border: "1px solid #3a404c",
            }}
        >
            {children}
        </div>
    );

    const Header = () => (
        <div
            style={{
                padding: "22px 24px",
                background:
                    "linear-gradient(135deg, rgba(94,167,67,0.25) 0%, rgba(35,39,47,0.6) 100%)",
                borderBottom: "1px solid #3a404c",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
            }}
        >
            <div>
                <h2 style={{ margin: 0, fontSize: "1.6rem", color: "#5EA743" }}>Perfil del Usuario</h2>
                <p style={{ margin: "6px 0 0 0", color: "#b7bfca", fontSize: ".95rem" }}>
                    Información de tu cuenta
                </p>
            </div>


        </div>
    );

    const Row = ({ label, value }) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 16,
                padding: "14px 0",
                borderBottom: "1px dashed #3a404c",
            }}
        >
            <div style={{ color: "#9aa1ac", fontWeight: 600 }}>{label}</div>
            <div style={{ color: "#e9edf2", wordBreak: "break-word" }}>{value || "-"}</div>
        </div>
    );

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
            <Card>
                <Header />
                <div style={{ padding: "18px 24px" }}>
                    <Row label="Nombre" value={user.nombre} />
                    <Row label="Apellido" value={user.apellido} />
                    <Row label="Correo" value={user.email} />


                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                        <button onClick={() => navigate(-1)} style={btnSecondary}>
                            Volver
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

const btnBase = {
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.95rem",
};

const btnSecondary = {
    ...btnBase,
    background: "#3a404c",
    color: "#e9edf2",
};