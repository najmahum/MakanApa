// File: src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/profile.css";

// --- UBAH DI SINI ---
// Hapus import UserOrange/UserGrey svg yang lama.
// Ganti dengan import komponen baru:
import ProfileIcon from "../assets/icons/profile.svg";

const Profile = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // (Data dummy user & useEffect tetap sama...)
  const userData = {
    username: "MakanYuk",
    nama: "MakanYuk",
    email: "MakanYuk@gmail.com",
    password: "••••••••••"
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h2 className="judul-halaman">Profile</h2>

      {isLogin ? (
        /* --- TAMPILAN SUDAH LOGIN --- */
        <div className="content-login">
          
          {/* --- UBAH BAGIAN ICON INI --- */}
          {/* Kita pakai komponen, kirim warna ORANYE */}
          <img src={ProfileIcon} alt="Profile"/>

          <div className="card-data">
             {/* ... (Isi card data user sama persis kayak sebelumnya) ... */}
             {/* Saya singkat biar gak kepanjangan */}
             <div className="data-row"><p className="label">Username</p><p className="value">{userData.username}</p></div>
             <div className="garis-batas"></div>
             <div className="data-row"><p className="label">Nama</p><p className="value">{userData.nama}</p></div>
             <div className="garis-batas"></div>
             <div className="data-row"><p className="label">Email</p><p className="value">{userData.email}</p></div>
             <div className="garis-batas"></div>
             <div className="data-row"><p className="label">Password</p><p className="value">{userData.password}</p></div>
          </div>

          <button className="btn-logout-orange" onClick={handleLogout}>
            Logout
          </button>
        </div>

      ) : (
        /* --- TAMPILAN BELUM LOGIN --- */
        <div className="content-guest">
          
          {/* --- UBAH BAGIAN ICON INI --- */}
          {/* Kita pakai komponen yang SAMA, tapi kirim warna ABU */}
          {/* Kalau tidak kirim prop 'color', dia pakai default abu yang kita set di komponen */}
          <img src={ProfileIcon} alt="Profile" />
          
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