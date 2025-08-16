// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  // Consulta al backend si hay usuario en sesión al cargar la app
  useEffect(() => {
    fetch("/api/usuarios/me", { credentials: "include" })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
        setChecked(true);
      })
      .catch(() => {
        setUser(null);
        setChecked(true);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {checked ? children : <div>Cargando sesión...</div>}
    </UserContext.Provider>
  );
}
