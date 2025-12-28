// src/pages/RestaurantApp.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar.jsx";
import Integrasi from "../config/integrasi";
import "../styles/RestaurantApp.css";

export default function RestaurantApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state;
  const savedData = JSON.parse(localStorage.getItem("searchParams") || "{}");

  const {
    query = "",
    lat = localStorage.getItem("latitude"),
    lng = localStorage.getItem("longitude"),
    jarak = null,
    priceCategory = null,
    minRating = null,
  } = stateData || savedData;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAddress, setUserAddress] = useState("Berdasarkan lokasi Anda");

  useEffect(() => {
    if (!lat || !lng) {
      setError("Lokasi tidak ditemukan");
      setLoading(false);
      return;
    }

    setLoading(true);

    Integrasi.get("/api/tempatmakan/cari", {
      params: { query, lat, lng, jarak, priceCategory, minRating },
    })
      .then((res) => {
        const data = res.data;
        
        // 🔥 DEBUG: Cek response dari backend
        console.log("=== BACKEND RESPONSE ===");
        console.log("Total restaurants:", data.data?.length);
        console.log("First restaurant:", data.data[0]);
        
        if (data.data && data.data.length > 0) {
          const first = data.data[0];
          console.log("First restaurant lat:", first.lat);
          console.log("First restaurant lng:", first.lng);
          console.log("Has lat?", !!first.lat);
          console.log("Has lng?", !!first.lng);
        }
        
        setRestaurants(data.data || []);

        if (data.user_address) {
          setUserAddress(data.user_address);
          localStorage.setItem("userAddress", data.user_address);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching restaurants:", err);
        setError("Gagal mengambil data restoran");
      })
      .finally(() => setLoading(false));
  }, [query, lat, lng, jarak, priceCategory, minRating]);

  const handleRestaurantClick = (restaurant) => {
    // 🔥 DEBUG: Cek data sebelum navigate
    console.log("🔍 Clicked restaurant:", restaurant);
    console.log("📍 Lat:", restaurant.lat, "Lng:", restaurant.lng);
    console.log("📦 Full data:", JSON.stringify(restaurant, null, 2));
    
    // Navigate ke detail (biarkan DetailView yang handle jika lat/lng tidak ada)
    navigate("/detail", {
      state: {
        ...restaurant,
        // Pastikan id dan place_id ada
        id: restaurant.id || restaurant.place_id,
        place_id: restaurant.place_id || restaurant.id,
      },
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="back-circle">
            <ArrowLeft size={22} />
          </span>
        </button>
        <h1 className="header-title">Rekomendasi Tempat Makan</h1>
      </header>

      <div className="location-bar">{userAddress}</div>

      <div className="search-section">
        <div className="search-box-display">{query || "Semua Makanan"}</div>

        <div className="filter-info">
          {priceCategory && <span>Harga: Kategori {priceCategory}</span>}
          {jarak && (
            <span>
              Jarak: {jarak === 1 ? "< 1 km" : jarak === 2 ? "1 - 3 km" : "> 3 km"}
            </span>
          )}
          {minRating && <span>Rating ≥ {minRating} ⭐</span>}
        </div>

        {!loading && (
          <p className="result-info">
            Ditemukan <strong>{restaurants.length}</strong> restoran
          </p>
        )}
      </div>

      {loading && <p className="loading-text">Memuat data...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="restaurant-list">
        {restaurants.map((r) => (
          <div
            key={r.id || r.place_id}
            className="restaurant-card"
            onClick={() => handleRestaurantClick(r)}
          >
            <img
              src={r.image || "/placeholder-food.jpg"}
              alt={r.name}
              className="restaurant-img"
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
              }}
            />

            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="specialty-text">{r.types?.join(", ") || r.specialty}</p>
              <p className="address-text">{r.address}</p>

              <div className="restaurant-meta">
                <span className="rating">
                  <Star size={14} fill="#fff" /> {r.rating || "-"}
                </span>
                <span className="distance">{r.distance?.toFixed(1)} km</span>
                {r.priceRange && (
                  <span className="price">
                    Rp {r.priceRange.min.toLocaleString()} - {r.priceRange.max.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Navbar active="home" />
    </div>
  );
}