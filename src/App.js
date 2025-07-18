// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/fonts.css';
import './assets/styles.css';
import HeaderSwitcher from './components/HeaderSwitcher';
import Footer from './components/Footer';
import Auth from './components/Auth';
import NotFound from './components/NotFound';
import Home from './components/Home';
import About from './components/About';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import AdminView from './components/AdminView';
import AdminProductos from './components/AdminProductos';
import { useUser } from "./context/UserContext";
import AdminTalleres from './components/AdminTalleres';
import AdminServicios from './components/AdminServicios';

function App() {
  const { user } = useUser();

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HeaderSwitcher />
        <div style={{ flex: 1 }}>
          {/* ADMIN */}
          {user && user.rol === "ADMIN" ? (
            <Routes>
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<AdminView />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="talleres" element={<AdminTalleres />} />
                <Route path="servicios" element={<AdminServicios />} />
                <Route path="*" element={<AdminView />} />
              </Route>
            </Routes>
          ) : (
            /* USUARIO NORMAL O VISITANTE */
            <>
              {user && <UserLayout />}
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
