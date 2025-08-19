// src/context/UserContext.jsx
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}

const STORAGE_KEY = "bio_user";

export function UserProvider({children}) {
    const storedRaw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    const storedUser = storedRaw ? safeParse(storedRaw) : null;

    const [user, _setUser] = useState(storedUser);
    const [checked, setChecked] = useState(true);

    // helper: parse seguro
    function safeParse(raw) {
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    // Setea usuario en estado + sessionStorage
    const setUserPersist = useCallback((newUser) => {
        _setUser(newUser);
        if (newUser) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // Validación en segundo plano con el backend
    useEffect(() => {
        let cancelled = false;
        fetch("/api/usuarios/me", {credentials: "include"})
            .then(async (res) => {
                if (cancelled) return;
                if (res.ok) {
                    const data = await res.json();
                    setUserPersist(data);
                } else {
                    if (!storedUser) setUserPersist(null);
                }
            })
            .catch(() => {
            })
            .finally(() => {
                if (!cancelled) setChecked(true);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshUserFromServer = useCallback(async () => {
        const res = await fetch("/api/usuarios/me", {credentials: "include"});
        if (res.ok) {
            const data = await res.json();
            setUserPersist(data);
            return {ok: true, data};
        }
        return {ok: false};
    }, [setUserPersist]);

    return (
        <UserContext.Provider value={{user, setUser: setUserPersist, refreshUserFromServer}}>
            {checked ? children : <div>Cargando sesión...</div>}
        </UserContext.Provider>
    );
}
