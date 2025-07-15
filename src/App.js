// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import AdminTalleres from './components/AdminTalleres';
import AdminServicios from './components/AdminServicios';
import Agendar from './components/Agendar';

import { useUser } from "./context/UserContext";

function App() {
  const { user } = useUser();

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HeaderSwitcher />
        <div style={{ flex: 1 }}>
          <Routes>
            {user && user.rol === "ADMIN" ? (
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<AdminView />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="talleres" element={<AdminTalleres />} />
                <Route path="servicios" element={<AdminServicios />} />
                <Route path="*" element={<AdminView />} />
              </Route>
            ) : (
              <>
                {/* Public routes, but wrapped with sidebar if logged in */}
                <Route path="/" element={user ? <UserLayout><Home /></UserLayout> : <Home />}/>
                <Route path="/about" element={user ? <UserLayout><About /></UserLayout> : <About />}/>

                {/* Protected route */}
                <Route element={user ? <UserLayout /> : <></>}>
                  <Route path="/agendar" element={<Agendar />} />
                </Route>

                <Route path="/login" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
