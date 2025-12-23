import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import Navbar from "../components/navbar.jsx";
import Integrasi from "../config/integrasi";
import "../styles/DetailView.css";

export default function DetailView() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // 🔥 DATA DARI RESTAURANTAPP
  // ==============================
  const initialData = location.state;

  const [restaurant, setRestaurant] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

  // ==============================
  // 🔥 FETCH JIKA HALAMAN DI-REFRESH
  // ==============================
  useEffect(() => {
    if (restaurant || !initialData?.place_id) return;

    setLoading(true);
    Integrasi.get("/api/tempatmakan/detail", {
      params: { place_id: initialData.place_id },
    })
      .then((res) => {
        setRestaurant(res.data.data);
      })
      .catch(() => {
        setError("Gagal mengambil detail restoran");
      })
      .finally(() => setLoading(false));
  }, [initialData, restaurant]);

  // ==============================
  // 🔥 LOADING / ERROR HANDLER
  // ==============================
  if (loading) return <p className="loading-text">Memuat detail...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!restaurant)
    return (
      <div style={{ padding: 20 }}>
        <p>Data restoran tidak ditemukan.</p>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );

  // ==============================
  // 🔥 GOOGLE MAPS URL (DINAMIS)
  // ==============================
  const mapsUrl =
    restaurant.lat && restaurant.lng
      ? `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}&output=embed`
      : null;

  const openInGoogleMaps = () => {
    if (restaurant.lat && restaurant.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
        "_blank"
      );
    }
  };

  // ==============================
  // 🔥 UI
  // ==============================
  return (
    <div className="container-app">
      {/* BACK BUTTON */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <span className="back-circle">
          <ArrowLeft size={22} />
        </span>
      </button>

      {/* HEADER IMAGE */}
      <div className="header-image-wrapper">
        <img
          className="header-image"
          src={restaurant.image || "/placeholder-food.jpg"}
          alt={restaurant.name}
          onError={(e) => (e.target.src = "/placeholder-food.jpg")}
        />
        <div className="header-overlay"></div>
        <h1 className="restaurant-title">{restaurant.name}</h1>
      </div>

      {/* CONTENT */}
      <div className="content">
        <div className="info-section">
          <p className="specialty">
            {restaurant.types?.join(", ") || "Restoran"}
          </p>

          <p className="address">{restaurant.address}</p>

          <div className="meta-info">
            <span className="meta-badge">
              <Star size={14} fill="#fff" /> {restaurant.rating || "-"}
            </span>

            {restaurant.distance && (
              <span className="meta-badge">
                {restaurant.distance.toFixed(1)} km
              </span>
            )}

            {restaurant.priceRange && (
              <span className="meta-badge">
                Rp {restaurant.priceRange.min.toLocaleString()} -{" "}
                {restaurant.priceRange.max.toLocaleString()}
              </span>
            )}
          </div>

          {/* 🔥 TOGGLE GOOGLE MAPS */}
          {mapsUrl && (
            <button
              className="map-button"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin size={18} />
              {showMap ? "Sembunyikan Peta" : "Lihat di Peta"}
            </button>
          )}
        </div>

        {/* 🔥 GOOGLE MAPS */}
        {showMap && mapsUrl && (
          <div className="map-container">
            <iframe
              className="map-iframe"
              src={mapsUrl}
              loading="lazy"
              title="Google Maps"
            />
            <button className="open-maps-button" onClick={openInGoogleMaps}>
              <MapPin size={18} />
              Buka di Google Maps
            </button>
          </div>
        )}
      </div>

      {/* NAVBAR */}
      <Navbar active="home" />
    </div>
  );
}