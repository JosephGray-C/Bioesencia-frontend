// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// css
import './assets/css/fonts.css';
import './assets/css/styles.css';

// Imports
import Home from './components/Home';
import Auth from './components/Auth';
import NotFound from './components/NotFound';
import About from './components/About';


import HeaderSwitcher from './components/HeaderSwitcher';
import Footer from './components/Footer';

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