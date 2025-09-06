import { useUser } from "../context/UserContext";

export function useIsAdmin() {
    const { user } = useUser();
    const rol = (user?.rol || "")
        .toString()
        .toUpperCase()
        .replace(/^ROLE_/, "");
    const esAdmin = rol === "ADMIN";
    return esAdmin;
}