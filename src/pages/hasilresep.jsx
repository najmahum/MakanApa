import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/hasilresep.css";
import ClockIcon from "../assets/icons/clock.svg"; 
import CheckIcon from "../assets/icons/check.svg";

const HasilResep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [recipes, setRecipes] = useState(location.state?.hasil || []);

  useEffect(() => {
    if (!location.state?.hasil) {

        setRecipes([
            {
                id: 1,
                title: "Nasi Goreng Kampung",
                image: "https://images.unsplash.com/photo-1603133872878-684f57da0498?q=80&w=1000&auto=format&fit=crop", // Ganti URL image asli
                match: 95,
                time: 30
            },
            {
                id: 2,
                title: "Telur Goreng Spesial",
                image: "https://images.unsplash.com/photo-1525351484163-7529414395d8?q=80&w=1000&auto=format&fit=crop",
                match: 90,
                time: 15
            },
            {
                id: 3,
                title: "Sup Telur Tomat",
                image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop",
                match: 85,
                time: 20
            }
        ]);
    }
  }, [location.state]);

  const handleResepClick = (id) => {
    // Navigasi ke detail resep (nanti dibuat)
    navigate(`/detailresep/${id}`);
  };

  return (
    <div className="hasil-container">
      {/* HEADER FIXED */}
      <div className="fixed-header">
        <Header title="Hasil Resep" backLink="/masukanbahan" />
      </div>

      {/* SCROLLABLE LIST */}
      <div className="recipe-list-area">
        <p className="summary-text">
          Ditemukan <span className="highlight-number">{recipes.length}</span> Resep yang cocok dengan bahan Anda.
        </p>
        {recipes.map((resep) => (
          <div 
            className="recipe-card" 
            key={resep.id} 
            onClick={() => handleResepClick(resep.id)}
          >
            {/* Gambar Resep */}
            <div className="card-image">
                <img src={resep.image} alt={resep.title} />
            </div>

            {/* Info Resep */}
            <div className="card-content">
                <h3>{resep.title}</h3>
                
                <div className="meta-info">
                    {/* Badge Kecocokan */}
                    <div className="match-badge">
                        <img src={CheckIcon} alt="match" />
                        <span>Cocok {resep.match}% dengan bahanmu</span>
                    </div>

                    {/* Waktu Masak */}
                    <div className="time-info">
                        <img src={ClockIcon} alt="time" />
                        <span>{resep.time} Menit</span>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {/* Space kosong di bawah biar card terakhir tidak ketutup navbar */}
        <div className="spacer-bottom"></div>
      </div>

      <Navbar />
    </div>
  );
};

export default HasilResep;