import { useUser } from "../context/UserContext";
import HeaderGuest from "./HeaderGuest";
import HeaderUser from "./HeaderUser";

export default function HeaderSwitcher() {
  const { user } = useUser();
  return user ? <HeaderUser /> : <HeaderGuest />;
}
