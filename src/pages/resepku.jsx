import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi"; // Import your Axios config
import "../styles/resepku.css";

// Import Assets
import FolderIcon from "../assets/icons/resepku.svg";
import UserGrey from "../assets/icons/profile.svg";
import AddFileIcon from "../assets/icons/addfile.svg";

const ResepKu = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Check Login Status & Fetch Data
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    
    if (token) {
      setIsLogin(true);
      fetchMyRecipes();
    } else {
      setIsLogin(false);
    }
  }, []);

  // 2. Fetch Function
  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      // Adjust endpoint to match your backend route for user's recipes
      // Example: /api/resep/my-recipes or similar
      const response = await Integrasi.get("/api/resep/user"); 
      
      // Assuming backend returns data in response.data.data
      setMyRecipes(response.data.data || []); 
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      // Optional: Handle error state here
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Detail Click
  const handleDetailClick = (item) => {
    navigate(`/resep/${item.id}`, { 
        state: { 
           isMyRecipe: true, 
           status: item.status, 
           feedback: item.feedback // Assuming backend sends feedback for rejected recipes
        } 
    });
  };

  return (
    <div className="resep-ku-container">
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

        ) : loading ? (
           // === KONDISI LOADING ===
           <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
              Memuat resepmu...
           </div>

        ) : myRecipes.length === 0 ? (
          
          // === KONDISI 2: LOGIN TAPI KOSONG (FOLDER) ===
          <div className="empty-state">
            <img src={FolderIcon} alt="Folder" className="icon-folder" />
            <p className="text-empty">Ups! Kamu belum menambahkan resep apapun</p>
          </div>

        ) : (
          
          // === KONDISI 3: ADA DATA (LIST) ===
          <div className="recipe-table">
            <div className="table-header">
               <span className="col-name">Nama Resep</span>
               <span className="col-status">Status</span>
               <span className="col-action"></span>
            </div>

            {myRecipes.map((item, index) => (
              <div className="table-row" key={item.id}>
                 <span className="col-num">{index + 1}</span>
                 <span className="col-name-val">{item.nama_resep || item.name}</span>
                 <span className="col-status-val">{item.status}</span>
                 <span className="col-action">
                <button 
                  className="btn-detail-outline"
                  onClick={() => handleDetailClick({
                  })}
                >
                  Detail
                </button>
                 </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOMBOL TAMBAH RESEP */}
      {isLogin && !loading && (
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