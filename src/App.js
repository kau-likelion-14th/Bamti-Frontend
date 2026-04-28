import react from "react";
import "../src/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/Mainpage/Mainpage.js"
import Footer from "./components/Footer.js";


function App() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
