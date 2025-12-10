import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi"; // Import koneksi backend
import "../styles/favorite.css";

// Import Assets
import SadFaceIcon from "../assets/icons/profile.svg";
import ClockIcon from "../assets/icons/clock.svg";
import HeartRedIcon from "../assets/icons/redheart.svg";
import FolderIcon from "../assets/icons/resepku.svg";

const Favorit = () => {
  const navigate = useNavigate();
  
  // 1. DEFAULT STATE: FALSE (Belum Login)
  const [isLogin, setIsLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. CEK LOGIN & AMBIL DATA SAAT HALAMAN DIBUKA
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    
    if (token) {
      setIsLogin(true);
      fetchFavorit(); // Ambil data kalau login
    } else {
      setIsLogin(false);
    }
  }, []);

  // 3. FUNGSI AMBIL DATA KE BACKEND
  const fetchFavorit = async () => {
    try {
      setLoading(true);
      // Sesuaikan endpoint dengan backend kamu (misal: /api/favorit)
      const response = await Integrasi.get("/api/favorit");
      
      // Simpan data ke state (asumsi data ada di response.data.data)
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error("Gagal ambil favorit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResepClick = (id) => {
    // Arahkan ke Detail Resep (gunakan page yang sama dengan pencarian)
    navigate(`/detailresep/${id}`);
  };

  return (
    <div className="favorit-container">
      <div className="fixed-header">
         <Header title="Resep Favorit" backLink="/home" />
      </div>

      <div className="favorit-content">
        
        {/* LOGIC TAMPILAN */}
        {!isLogin ? (
          // --- KONDISI 1: BELUM LOGIN (GUEST) ---
          <div className="fav-guest">
            <img src={SadFaceIcon} alt="Sad" className="guest-icon-fav" />
            <p className="guest-text-bold">Wah kamu belum login..</p>
            <Link to="/login" className="link-text">
                <p className="guest-text">Login untuk menyimpan resep favoritmu!</p>
            </Link>
          </div>

        ) : loading ? (
          // --- KONDISI 2: SEDANG LOADING ---
          <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
            Memuat resep favorit...
          </div>

        ) : favorites.length === 0 ? (
          // --- KONDISI 3: SUDAH LOGIN TAPI KOSONG ---
          <div className="fav-guest">
             {/* Pakai icon folder atau sad face juga boleh */}
             <img src={FolderIcon} alt="Kosong" style={{width: '80px', opacity: 0.5, marginBottom: '20px'}} />
             <p className="guest-text-bold">Belum ada resep favorit</p>
             <p className="guest-text">Yuk cari resep dan simpan di sini!</p>
          </div>

        ) : (
          // --- KONDISI 4: ADA DATA (LIST RESEP) ---
          <div className="fav-list-area">
            {favorites.map((resep) => (
              <div className="fav-card" key={resep.id} onClick={() => handleResepClick(resep.id)}>
                {/* Gambar dengan Fallback */}
                <img 
                    src={resep.gambar || "https://via.placeholder.com/300x150?text=No+Image"} 
                    alt={resep.nama_resep} 
                    className="fav-img"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x150?text=Error"; }}
                />
                
                <div className="fav-info">
                  <h3>{resep.nama_resep}</h3>
                  <div className="fav-meta">
                    <div className="time">
                        <img src={ClockIcon} alt="time" /> 
                        {resep.durasi} Menit
                    </div>
                    <img src={HeartRedIcon} alt="love" className="love-icon" />
                  </div>
                </div>
              </div>
            ))}
            <div className="spacer-bottom"></div>
          </div>
        )}

      </div>

      <Navbar />
    </div>
  );
};

export default Favorit;