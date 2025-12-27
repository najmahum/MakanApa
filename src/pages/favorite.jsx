import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi";
import "../styles/resepku.css"; // PENTING: Pakai CSS yang sama dengan ResepKu

// Import Assets
import FolderIcon from "../assets/icons/resepku.svg";
import UserGrey from "../assets/icons/profile.svg";

const Favorit = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. CEK LOGIN (SAMA PERSIS DENGAN RESEPKU)
  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Pakai userToken sesuai ResepKu
    
    if (token) {
      setIsLogin(true);
      fetchFavorit();
    } else {
      setIsLogin(false);
    }
  }, []);

  // 2. AMBIL DATA
  const fetchFavorit = async () => {
    try {
      setLoading(true);
      const response = await Integrasi.get("/api/favorit");
      
      const rawData = response.data.data || [];
      
      // 🔥 FIX PENTING: Ratakan Data (Flatten)
      // Karena Backend kirim: { resep: { nama_resep: ... } }
      // Kita ubah biar Tabel bisa bacanya gampang
      const cleanData = rawData.map(item => {
          if (item.resep) {
              return {
                  id_fav: item.id_fav,
                  id_resep: item.resep.id_resep, // ID untuk navigasi
                  nama_resep: item.resep.nama_resep,
                  durasi: item.resep.durasi,
                  // Favorit gak punya status, kita ganti jadi kategori/info lain
                  info: item.resep.porsi ? `${item.resep.porsi} Porsi` : 'Disukai' 
              };
          }
          return item;
      });

      setFavorites(cleanData);
    } catch (error) {
      console.error("Gagal ambil favorit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (id) => {
    navigate(`/detailresep/${id}`); // Arahkan ke detail resep asli
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
            <p className="text-guest-small">Login dulu untuk melihat resep yang kamu simpan!</p>
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
          // Kita gunakan class CSS yang sama persis dengan ResepKu
          <div className="recipe-table">
            
            {/* Header Tabel */}
            <div className="table-header">
               <span className="col-num"></span> 
               <span className="col-name">Nama Resep</span>
               <span className="col-status">Info</span> 
               <span className="col-action"></span>
            </div>

            {/* List Data */}
            {favorites.map((item, index) => (
              <div className="table-row" key={item.id_fav || index}>
                 {/* No */}
                 <span className="col-num-val">{index + 1}</span>
                 
                 {/* Nama Resep */}
                 <span className="col-name-val">{item.nama_resep}</span>
                 
                 {/* Info / Durasi / Porsi */}
                 <span className="col-status-val">
                    {item.info}
                 </span>
                 
                 {/* Tombol Detail */}
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