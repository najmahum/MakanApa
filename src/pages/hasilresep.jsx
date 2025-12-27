import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/hasilresep.css";
import ClockIcon from "../assets/icons/clock.svg";
import CheckIcon from "../assets/icons/check.svg";
import RedHeart from "../assets/icons/redheart.svg";
import FavoriteEmpty from "../assets/icons/favorite.svg";
import Integrasi from "../config/integrasi";

const HasilResep = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [imgErrorState, setImgErrorState] = useState({});

  useEffect(() => {
    let rawData = location.state?.hasil;
    if (!rawData) {
        const savedSession = sessionStorage.getItem("hasilResepSession");
        if (savedSession) rawData = JSON.parse(savedSession);
    }
    if (rawData) sessionStorage.setItem("hasilResepSession", JSON.stringify(rawData));

    let listResep = [];
    if (rawData?.data?.data?.rekomendasi && Array.isArray(rawData.data.data.rekomendasi)) {
        listResep = rawData.data.data.rekomendasi;
    } else if (rawData?.data?.rekomendasi && Array.isArray(rawData.data.rekomendasi)) {
        listResep = rawData.data.rekomendasi;
    } else if (rawData?.rekomendasi && Array.isArray(rawData.rekomendasi)) {
        listResep = rawData.rekomendasi;
    } else if (Array.isArray(rawData)) {
        listResep = rawData;
    }
    setRecipes(listResep);

    const fetchUserFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await Integrasi.get("/api/favorit");
            const dataFav = response.data.data;

            const favMap = {};
            dataFav.forEach(item => {
                favMap[item.id_resep] = true;
            });

            setFavorites(favMap);
        } catch (error) {
            console.log("Gagal ambil data favorit (Mungkin belum login):", error);
        }
    };

    fetchUserFavorites();
  }, [location.state]);

  const handleResepClick = (id) => navigate(`/resep/${id}`);
  
  const handleCariLagi = () => {
    sessionStorage.removeItem("hasilResepSession");
    navigate("/masukanbahan");
  };

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Silakan login dulu untuk menyimpan resep favorit!");
        return;
    }

    const isCurrentlyFav = favorites[id];
    setFavorites(prev => ({ ...prev, [id]: !isCurrentlyFav }));

    try {
        if (isCurrentlyFav) {
            await Integrasi.delete(`/api/favorit/${id}`);
        } else {
            await Integrasi.post("/api/favorit", { id_resep: id });
        }
    } catch (error) {
        console.error("Gagal update favorit:", error);
        setFavorites(prev => ({ ...prev, [id]: isCurrentlyFav }));
        alert("Gagal menyimpan favorit. Cek koneksi internet.");
    }
  };

  const handleImageError = (id) => {
    setImgErrorState((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="hasil-container">
      <div className="fixed-header">
        <Header title="Hasil Resep" backLink="/masukanbahan" />
      </div>

      <div className="recipe-list-area">
        <p className="summary-text">
          Ditemukan <span className="highlight-number">{recipes.length}</span> Resep yang cocok dengan bahan Anda.
        </p>

        {recipes.length === 0 ? (
            <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
                <p>Belum ada data resep.</p>
                <button onClick={handleCariLagi} style={{marginTop: '20px', padding: '10px 20px', background: '#FF5858', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Cari Bahan Lain</button>
            </div>
        ) : (
            recipes.map((resep, index) => {
                const currentId = resep.id_resep || index;
                const isFav = favorites[currentId] || false;

                const isImageValid = resep.gambar && !imgErrorState[currentId];

                return (
                    <div
                        className="recipe-card"
                        key={currentId}
                        onClick={() => handleResepClick(currentId)}
                    >
                        <div className="card-image">
                            {isImageValid ? (
                                <img
                                    src={resep.gambar}
                                    alt={resep.nama_resep}
                                    onError={() => handleImageError(currentId)}
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    <span>{resep.nama_resep || "Resep"}</span>
                                </div>
                            )}
                        </div>

                        <div className="card-content">
                            <div className="card-text-info">
                                <h3>{resep.nama_resep || "Tanpa Judul"}</h3>
                                <div className="meta-info">
                                    {resep.kecocokan && (
                                        <div className="match-badge">
                                            <img src={CheckIcon} alt="match" />
                                            <span>Cocok {Math.round(resep.kecocokan)}%</span>
                                        </div>
                                    )}
                                    <div className="time-info">
                                        <img src={ClockIcon} alt="time" />
                                        <span>{resep.durasi || "15"} Menit</span>
                                    </div>
                                </div>
                            </div>

                            <button className="card-btn-love" onClick={(e) => toggleFavorite(e, currentId)}>
                                <img
                                    src={isFav ? RedHeart : FavoriteEmpty}
                                    alt="favorite"
                                />
                            </button>
                        </div>
                    </div>
                );
            })
        )}
        <div className="spacer-bottom"></div>
      </div>
      <Navbar />
    </div>
  );
};

export default HasilResep;