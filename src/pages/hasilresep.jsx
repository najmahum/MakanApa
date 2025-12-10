import React, { useState } from "react"; // Hapus useEffect karena gak dipake lagi
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/hasilresep.css";
import ClockIcon from "../assets/icons/clock.svg"; 
import CheckIcon from "../assets/icons/check.svg";

const HasilResep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [recipes] = useState(location.state?.hasil || []);

  const handleResepClick = (id) => {
    navigate(`/resep/${id}`);
  };

  return (
    <div className="hasil-container">
      {/* HEADER FIXED */}
      <div className="fixed-header">
        <Header title="Hasil Resep" backLink="/masukanbahan" />
      </div>

      {/* SCROLLABLE LIST */}
      <div className="recipe-list-area">
        
        {/* LOGIC JUMLAH RESEP */}
        <p className="summary-text">
          Ditemukan <span className="highlight-number">{recipes.length}</span> Resep yang cocok dengan bahan Anda.
        </p>

        {/* LOGIC JIKA KOSONG (0 Resep) */}
        {recipes.length === 0 ? (
            <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
                <p>Yah, belum ada resep yang cocok :(</p>
                <p style={{fontSize: '12px', marginTop: '5px'}}>Atau kamu belum mencari resep.</p>
                
                <button 
                    onClick={() => navigate("/masukanbahan")} 
                    style={{marginTop: '20px', padding: '10px 20px', background: '#FF5858', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'}}
                >
                    Cari Bahan Lain
                </button>
            </div>
        ) : (
            // LOGIC MAPPING RESEP (DARI BACKEND)
            recipes.map((resep) => (
            <div 
                className="recipe-card" 
                key={resep.id} 
                onClick={() => handleResepClick(resep.id)}
            >
                {/* Gambar Resep */}
                <div className="card-image">
                    <img 
                        src={resep.image || "https://via.placeholder.com/300x200?text=No+Image"} 
                        alt={resep.title} 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading"; }}
                    />
                </div>

                {/* Info Resep */}
                <div className="card-content">
                    {/* Mengantisipasi perbedaan nama field dari backend (title vs Nama_Resep) */}
                    <h3>{resep.title || resep.Nama_Resep || "Tanpa Judul"}</h3> 
                    
                    <div className="meta-info">
                        {/* Badge Kecocokan */}
                        {resep.match && (
                            <div className="match-badge">
                                <img src={CheckIcon} alt="match" />
                                <span>Cocok {resep.match}% dengan bahanmu</span>
                            </div>
                        )}

                        {/* Waktu Masak */}
                        <div className="time-info">
                            <img src={ClockIcon} alt="time" />
                            <span>{resep.time || resep.Estimasi_Waktu || "15"} Menit</span>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}

        <div className="spacer-bottom"></div>
      </div>

      <Navbar />
    </div>
  );
};

export default HasilResep;