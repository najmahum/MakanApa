import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/profile.css";
import UserOrange from "../assets/icons/user-orange.svg"; 
import UserGrey from "../assets/icons/user-gray.svg";       

const Profile = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  
  // State User (Default kosong)
  const [user, setUser] = useState({
    username: "-",
    nama: "-",
    email: "-",
    password: "••••••••••" // Password disensor (biasanya tidak disimpan di localstorage)
  });

  useEffect(() => {
    // 1. Ambil Token & Data User dari LocalStorage
    const token = localStorage.getItem("userToken");
    const savedData = localStorage.getItem("userData");
    
    if (token && savedData) {
      setIsLogin(true);
      
      // 2. Parse Data JSON jadi Objek
      try {
        const parsedUser = JSON.parse(savedData);
        setUser({
            username: parsedUser.username || "-",
            nama: parsedUser.nama || parsedUser.username || "-", // Fallback ke username kalau nama kosong
            email: parsedUser.email || "-",
            password: "••••••••••" 
        });
      } catch (e) {
        console.error("Gagal membaca data user", e);
      }
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    // 3. Hapus Semua Data Sesi
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("draftBahan");
    
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h2 className="judul-halaman">Profile</h2>

      {isLogin ? (
        /* --- TAMPILAN SUDAH LOGIN (DATA ASLI) --- */
        <div className="content-login">
          
          <img src={UserOrange} alt="User" className="big-avatar" />

          <div className="card-data">
             <div className="data-row">
                <p className="label">Username</p>
                <p className="value">{user.username}</p>
             </div>
             <div className="garis-batas"></div>
             
             <div className="data-row">
                <p className="label">Nama</p>
                <p className="value">{user.nama}</p>
             </div>
             <div className="garis-batas"></div>
             
             <div className="data-row">
                <p className="label">Email</p>
                <p className="value">{user.email}</p>
             </div>
             <div className="garis-batas"></div>
             
             <div className="data-row">
                <p className="label">Password</p>
                <p className="value">{user.password}</p>
             </div>
          </div>

          <button className="btn-logout-orange" onClick={handleLogout}>
            Logout
          </button>
        </div>

      ) : (
        /* --- TAMPILAN BELUM LOGIN (GUEST) --- */
        <div className="content-guest">
          
          <img src={UserGrey} alt="Guest" className="big-avatar" />
          
          <div className="text-wrapper">
            <p className="text-guest-bold">Wah kamu belum login..</p>
            <Link to="/login" className="link-text">
                <p className="text-guest">Login untuk mengatur profilemu!</p>
            </Link>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Profile;