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

  const userAddress =
    localStorage.getItem("userAddress") || "Berdasarkan lokasi Anda";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setRestaurants(res.data.data || []);
      })
      .catch(() => {
        setError("Gagal mengambil data restoran");
      })
      .finally(() => setLoading(false));
  }, [query, lat, lng, jarak, priceCategory, minRating]);

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

      <div className="location-bar">📍 {userAddress}</div>

      <div className="search-section">
        <div className="search-box-display">
          {query || "Semua Makanan"}
        </div>

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
            key={r.place_id}
            className="restaurant-card"
            onClick={() => navigate("/detail", { state: r })}
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
              <p className="specialty-text">{r.types?.join(", ")}</p>
              <p className="address-text">{r.address}</p>

              <div className="restaurant-meta">
                <span className="rating">
                  <Star size={14} fill="#fff" /> {r.rating || "-"}
                </span>
                <span className="distance">
                  {r.distance?.toFixed(1)} km
                </span>
                {r.priceRange && (
                  <span className="price">
                    Rp {r.priceRange.min.toLocaleString()} -{" "}
                    {r.priceRange.max.toLocaleString()}
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
