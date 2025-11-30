import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header"; // Pakai Header biar ada tombol back merah
import "../styles/resepku.css";

// Import Assets
import FolderIcon from "../assets/icons/resepku.svg";
import UserGrey from "../assets/icons/profile.svg";
import AddFileIcon from "../assets/icons/addfile.svg";

const ResepKu = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // STATE RESEP (Nanti ini dari Backend)
  // Aku isi Dummy Data biar tampilan LIST-nya muncul kayak di gambar
  const [myRecipes, setMyRecipes] = useState([
    { id: 1, name: "Telur Goreng Sawi", status: "Pending" },
    { id: 2, name: "Tahu Crispy", status: "Approved" },
    { id: 3, name: "Mie Sedaap Goreng", status: "Rejected" },
  ]);

  // Kalau mau liat tampilan Folder Kosong, ubah useState di atas jadi: useState([])

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLogin(!!token);
  }, []);

  return (
    <div className="resep-ku-container">
      
      {/* Header dengan Back Button sesuai gambar */}
      <div className="header-padding">
        <Header title="Resepku" backLink="/home" />
      </div>

      <div className="content-area">
        
        {/* LOGIC UTAMA */}
        {!isLogin ? (
          // === KONDISI 1: BELUM LOGIN (GUEST) ===
          <div className="guest-state">
            <img src={UserGrey} alt="Guest" className="icon-guest" />
            <p className="text-guest-bold">Wah kamu belum login..</p>
            <p className="text-guest-small">Login untuk menyimpan resep favoritmu!</p>
            <Link to="/login" className="link-text-red">Login Sekarang</Link>
          </div>

        ) : myRecipes.length === 0 ? (
          
          // === KONDISI 2: LOGIN TAPI KOSONG (FOLDER) ===
          <div className="empty-state">
            <img src={FolderIcon} alt="Folder" className="icon-folder" />
            <p className="text-empty">Ups! Kamu belum menambahkan resep apapun</p>
          </div>

        ) : (
          
          // === KONDISI 3: ADA DATA (LIST) - SESUAI GAMBAR BARU ===
          <div className="recipe-table">
            
            {/* Header Tabel */}
            <div className="table-header">
               <span className="col-name">Nama Resep</span>
               <span className="col-status">Status</span>
               <span className="col-action"></span>
            </div>

            {/* List Item Loop */}
            {myRecipes.map((item, index) => (
              <div className="table-row" key={item.id}>
                 <span className="col-num">{index + 1}</span>
                 <span className="col-name-val">{item.name}</span>
                 <span className="col-status-val">{item.status}</span>
                 <span className="col-action">
                    <button className="btn-detail-outline">Detail</button>
                 </span>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* TOMBOL TAMBAH RESEP (Hanya muncul jika sudah login) */}
      {isLogin && (
        <div className="fixed-bottom-btn">
          <button 
              className="btn-big-red" 
              onClick={() => navigate("/tambah-resep")}
          >
              <img src={AddFileIcon} alt="Add" />
              TAMBAH RESEP
          </button>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default ResepKu;