import react from "react";
import "/Users/name/Desktop/my-project/src/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/Mainpage/Mainpage.js"
import Footer from "./components/Footer.js";


function App() {
  return (
    <div> 
      <Header />
    
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>

      <Footer />
    </div>

  );
}

export default App;
