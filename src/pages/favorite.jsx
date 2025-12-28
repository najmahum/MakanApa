import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi";
import "../styles/resepku.css";

// Import Assets
import FolderIcon from "../assets/icons/resepku.svg";
import UserGrey from "../assets/icons/user-gray.svg";

const Favorit = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. CEK LOGIN
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLogin(true);
      fetchFavorit();
    } else {
      setIsLogin(false);
    }
  }, []);

  // 2. AMBIL DATA FAVORIT
  const fetchFavorit = async () => {
    try {
      setLoading(true);
      const response = await Integrasi.get("/api/favorit");
      const rawData = response.data.data || [];

      // Mapping data agar sesuai struktur tabel
      const cleanData = rawData.map((item) => {
        // Cek apakah data resep ada di dalam object (tergantung respons API)
        const resepData = item.resep || item; 
        
        return {
          id_fav: item.id_fav || item.id,
          id_resep: resepData.id_resep,
          nama_resep: resepData.nama_resep,
          // Kita pakai kolom status untuk menampilkan Porsi/Durasi
          info: resepData.porsi ? `${resepData.porsi} Porsi` : `${resepData.durasi || '-'} Menit`
        };
      });

      setFavorites(cleanData);
    } catch (error) {
      console.error("Gagal ambil favorit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (id) => {
    navigate(`/resep/${id}`);
  };

  return (
    <div className="resep-ku-container">
      <div className="header-padding">
        <Header title="Resep Favorit" backLink="/home" />
      </div>

      <div className="content-area">
        {/* LOGIC TAMPILAN */}
        {!isLogin ? (
          // === BELUM LOGIN ===
          <div className="guest-state">
            <img src={UserGrey} alt="Guest" className="icon-guest" />
            <p className="text-guest-bold">Wah kamu belum login..</p>
            <p className="text-guest-small">Login untuk melihat resep simpananmu!</p>
            <Link to="/login" className="link-text-red">Login Sekarang</Link>
          </div>

        ) : loading ? (
           // === LOADING ===
           <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
             Memuat favoritmu...
           </div>

        ) : favorites.length === 0 ? (
          // === KOSONG ===
          <div className="empty-state">
            <img src={FolderIcon} alt="Empty" className="icon-folder" />
            <p className="text-empty">Belum ada resep yang disukai</p>
          </div>

        ) : (
          // === ADA DATA (TABEL GRID) ===
          <div className="recipe-table">
            
            {/* Header Tabel */}
            <div className="table-header">
               <span className="col-num"></span> 
               <span className="col-name">Nama Resep</span>
               <span className="col-status">Info</span> {/* Judul kolom disesuaikan */}
               <span className="col-action"></span>
            </div>

            {/* List Data */}
            {favorites.map((item, index) => (
              <div className="table-row" key={index}>
                 {/* 1. Nomor */}
                 <span className="col-num-val">{index + 1}</span>
                 
                 {/* 2. Nama Resep */}
                 <span className="col-name-val">{item.nama_resep}</span>
                 
                 {/* 3. Info (Porsi/Durasi) - Masuk ke slot Status */}
                 <span className="col-status-val">
                    {item.info}
                 </span>
                 
                 {/* 4. Tombol Detail */}
                 <span className="col-action">
                    <button 
                      className="btn-detail-outline"
                      onClick={() => handleDetailClick(item.id_resep)} 
                    >
                      Detail
                    </button>
                 </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Favorit;