import react from "react";
import "../src/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/Mainpage/Mainpage.js";
import LoginPage from "./pages/LoginPage/LoginPage.js";
import Footer from "./components/Footer.js";
import MyPage from "./pages/MyPage/MyPage.js";
import FriendPage from "./pages/FriendPage/FriendPage.js";
import FriendDetailPage from "./pages/FriendPage/FriendDetailPage.js";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/friends" element={<FriendPage />} />
        {/* 친구 상세 페이지: /friends/:id */}
        <Route path="/friends/:id" element={<FriendDetailPage />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
