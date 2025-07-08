// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/fonts.css';
import './assets/styles.css';
import HeaderSwitcher from './components/HeaderSwitcher';
import Footer from './components/Footer';
import Home from './components/Home';
import Auth from './components/Auth';
import NotFound from './components/NotFound';
import About from './components/About';

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HeaderSwitcher />
        <div style={{ flex: "1" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
