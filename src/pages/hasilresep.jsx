import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi";
import "../styles/hasilresep.css";

// Assets
import ClockIcon from "../assets/icons/clock.svg";
import CheckIcon from "../assets/icons/check.svg";
import RedHeart from "../assets/icons/redheart.svg";
import FavoriteEmpty from "../assets/icons/favorite.svg";

const HasilResep = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [imgErrorState, setImgErrorState] = useState({});

  // --- 1. Load Data & Favorites saat Pertama Render ---
  useEffect(() => {
    // A. Ambil Data Resep (Priority: State > Session)
    let rawData = location.state?.hasil;
    if (!rawData) {
      const savedSession = sessionStorage.getItem("hasilResepSession");
      if (savedSession) rawData = JSON.parse(savedSession);
    }

    if (rawData) {
      sessionStorage.setItem("hasilResepSession", JSON.stringify(rawData));
      
      // Logic pembersihan data yang lebih rapi (Chaining)
      const listResep = rawData?.data?.data?.rekomendasi 
        || rawData?.data?.rekomendasi 
        || rawData?.rekomendasi 
        || (Array.isArray(rawData) ? rawData : []);
        
      setRecipes(listResep);
    }

    // B. Ambil Data Favorit User (Jika Login)
    fetchUserFavorites();
  }, [location.state]);


  // --- 2. Fungsi Fetch Favorites ---
  const fetchUserFavorites = async () => {
    // PERBAIKAN: Gunakan 'userToken' agar konsisten dengan file lain
    const token = localStorage.getItem("userToken"); 
    if (!token) return;

    try {
      const response = await Integrasi.get("/api/favorit");
      const dataFav = response.data.data || [];
      
      // Ubah array ke object map biar aksesnya cepat O(1)
      const favMap = dataFav.reduce((acc, item) => {
        acc[item.id_resep] = true;
        return acc;
      }, {});

      setFavorites(favMap);
    } catch (error) {
      console.warn("Silent Fail: Gagal ambil data favorit (mungkin token expired)", error);
    }
  };


  // --- 3. Handle Actions ---
  const handleResepClick = (id) => navigate(`/resep/${id}`);

  const handleCariLagi = () => {
    sessionStorage.removeItem("hasilResepSession");
    navigate("/masukanbahan");
  };

  const handleImageError = (id) => {
    setImgErrorState((prev) => ({ ...prev, [id]: true }));
  };

  const toggleFavorite = async (e, id) => {
    e.stopPropagation(); // Biar gak kepencet card-nya

    // PERBAIKAN: Cek 'userToken'
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Silakan login dulu untuk menyimpan resep favorit!");
      // Opsional: navigate('/login')
      return;
    }

    const isCurrentlyFav = favorites[id];

    // Optimistic UI: Update tampilan dulu biar kerasa cepet
    setFavorites((prev) => ({ ...prev, [id]: !isCurrentlyFav }));

    try {
      if (isCurrentlyFav) {
        await Integrasi.delete(`/api/favorit/${id}`);
      } else {
        await Integrasi.post("/api/favorit", { id_resep: id });
      }
    } catch (error) {
      console.error("Gagal update favorit:", error);
      // Kalau gagal, balikin status tombol ke semula
      setFavorites((prev) => ({ ...prev, [id]: isCurrentlyFav }));
      alert("Gagal menyimpan favorit. Cek koneksi internet.");
    }
  };

  // --- 4. Render Component ---
  return (
    <div className="hasil-container">
      <div className="fixed-header">
        <Header title="Hasil Resep" backLink="/masukanbahan" />
      </div>

      <div className="recipe-list-area">
        <p className="summary-text">
          Ditemukan <span className="highlight-number">{recipes.length}</span> Resep yang cocok.
        </p>

        {recipes.length === 0 ? (
          <EmptyState onRetry={handleCariLagi} />
        ) : (
          recipes.map((resep, index) => (
            <RecipeCard 
              key={resep.id_resep || index}
              data={resep}
              isFav={favorites[resep.id_resep || index]}
              imgError={imgErrorState[resep.id_resep || index]}
              onImgError={handleImageError}
              onClick={handleResepClick}
              onToggleFav={toggleFavorite}
            />
          ))
        )}
        <div className="spacer-bottom"></div>
      </div>
      <Navbar />
    </div>
  );
};

// --- Sub-Components (Biar kode utama bersih) ---

const EmptyState = ({ onRetry }) => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
    <p>Belum ada data resep.</p>
    <button 
      onClick={onRetry} 
      style={{
        marginTop: '20px', padding: '10px 20px', background: '#FF5858', 
        color: 'white', border: 'none', borderRadius: '20px', 
        cursor: 'pointer', fontWeight: 'bold'
      }}
    >
      Cari Bahan Lain
    </button>
  </div>
);

const RecipeCard = ({ data, isFav, imgError, onImgError, onClick, onToggleFav }) => {
  const id = data.id_resep;
  const hasImage = data.gambar && !imgError;

  return (
    <div className="recipe-card" onClick={() => onClick(id)}>
      {/* Gambar */}
      <div className="card-image">
        {hasImage ? (
          <img 
            src={data.gambar} 
            alt={data.nama_resep} 
            onError={() => onImgError(id)} 
          />
        ) : (
          <div className="no-image-placeholder">
            <span>{data.nama_resep || "Resep"}</span>
          </div>
        )}
      </div>

      {/* Konten Text */}
      <div className="card-content">
        <div className="card-text-info">
          <h3>{data.nama_resep || "Tanpa Judul"}</h3>
          <div className="meta-info">
            {data.kecocokan && (
              <div className="match-badge">
                <img src={CheckIcon} alt="match" />
                <span>Cocok {Math.round(data.kecocokan)}%</span>
              </div>
            )}
            <div className="time-info">
              <img src={ClockIcon} alt="time" />
              <span>{data.durasi || "15"} Menit</span>
            </div>
          </div>
        </div>

        {/* Tombol Favorite */}
        <button className="card-btn-love" onClick={(e) => onToggleFav(e, id)}>
          <img src={isFav ? RedHeart : FavoriteEmpty} alt="favorite" />
        </button>
      </div>
    </div>
  );
};

export default HasilResep;