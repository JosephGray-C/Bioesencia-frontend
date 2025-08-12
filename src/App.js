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
import AdminCitas from "./components/AdminCitas";
import AdminOrdenes from './components/AdminOrdenes';

import Productos from './components/Productos';
import Carrito from './components/Carrito';
import ResumenCompra from './components/ResumenCompra';
import OrdenConfirmada from './components/OrdenConfirmada';

import Blog from "./components/Blog";
import CrearPost from "./components/CrearPost";
import EditarPost from "./components/EditarPost";
import BlogUsuario from "./components/BlogUsuario";

import TalleresPage from "./components/TalleresPage";
import TallerDetallePage from "./components/TallerDetallePage";
import AdminInscripciones from "./components/AdminInscripciones";

import Calendario from "./components/Calendario";
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
                <Route path="citas" element={<AdminCitas />} />
                <Route path="inscripciones" element={<AdminInscripciones />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/crear" element={<CrearPost />} />
                <Route path="blog/editar/:id" element={<EditarPost />} />
                {/* Add more admin routes as needed */}
                <Route path="ordenes" element={<AdminOrdenes />} />
                <Route path="*" element={<AdminView />} />
              </Route>
            ) : (
              <>
                {/* Public routes, but wrapped with sidebar if logged in */}
                <Route path="/" element={user ? <UserLayout><Home /></UserLayout> : <Home />}/>
                <Route path="/about" element={user ? <UserLayout><About /></UserLayout> : <About />}/>
                <Route path="/blogusuario" element={user ? <UserLayout><BlogUsuario /></UserLayout> : <BlogUsuario />} />

                {/* Protected route */}
                <Route element={user ? <UserLayout /> : <></>}>
                <Route path="/productos" element={<Productos />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/resumen" element={<ResumenCompra />} />
                  <Route path="/orden/:codigo" element={<OrdenConfirmada />} />
                  <Route path="/agendar" element={<Agendar />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/calendario" element={<Calendario />} />
                  <Route path="/talleres" element={<TalleresPage />} />
                  <Route path="/talleres/:id" element={<TallerDetallePage />} />
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