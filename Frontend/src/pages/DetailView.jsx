// src/pages/DetailView.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, ExternalLink, Clock, Phone, Globe, DollarSign } from "lucide-react";
import Navbar from "../components/navbar.jsx";
import Integrasi from "../config/integrasi";
import "../styles/DetailView.css";

export default function DetailView() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state;

  const [restaurant, setRestaurant] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const mapRef = useRef(null);

  // Fallback fetch jika refresh halaman
  useEffect(() => {
    if (restaurant || !initialData?.place_id) return;

    setLoading(true);
    Integrasi.get("/api/tempatmakan/detail", {
      params: { place_id: initialData.place_id },
    })
      .then((res) => setRestaurant(res.data.data))
      .catch(() => setError("Gagal mengambil detail restoran"))
      .finally(() => setLoading(false));
  }, [initialData, restaurant]);

  // Auto scroll ke maps saat dibuka
  useEffect(() => {
    if (showMap && mapRef.current) {
      mapRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest" 
      });
    }
  }, [showMap]);

  if (loading) return <p className="loading-text">Memuat detail...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!restaurant) return <p className="no-data-text">Data restoran tidak ditemukan</p>;

  const hasLocation = restaurant.lat && restaurant.lng;

  const mapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}&output=embed`
    : null;

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const openGoogleMapsSearch = () => {
    if (hasLocation) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
        "_blank"
      );
    } else if (restaurant.name && restaurant.address) {
      const searchQuery = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${searchQuery}`,
        "_blank"
      );
    } else if (restaurant.name) {
      const searchQuery = encodeURIComponent(restaurant.name);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${searchQuery}`,
        "_blank"
      );
    }
  };

  const getDirections = () => {
    const userLat = localStorage.getItem("latitude");
    const userLng = localStorage.getItem("longitude");

    if (userLat && userLng && hasLocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${restaurant.lat},${restaurant.lng}&travelmode=driving`,
        "_blank"
      );
    } else if (hasLocation) {
      openGoogleMapsSearch();
    }
  };

  // Format jam buka (dummy, bisa diganti dengan data real)
  const getOperatingHours = () => {
    if (restaurant.opening_hours) {
      return restaurant.opening_hours;
    }
    return "Senin - Minggu: 08.00 - 21.00";
  };

  return (
    <div className="container-app">
      {/* BACK BUTTON */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <span className="back-circle">
          <ArrowLeft size={20} />
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
          {/* SPECIALTY */}
          <p className="specialty">
            {restaurant.types?.join(", ") || restaurant.specialty || "Aneka Makanan"}
          </p>

          {/* ADDRESS */}
          <p className="address">{restaurant.address}</p>

          {/* META INFO */}
          <div className="meta-info">
            <span className="meta-badge">
              <Star size={14} fill="currentColor" /> {restaurant.rating || "-"}
            </span>
            {restaurant.distance && (
              <span className="meta-badge">
                <MapPin size={14} /> {restaurant.distance.toFixed(1)} km
              </span>
            )}
            {restaurant.priceRange && (
              <span className="meta-badge">
                Rp {restaurant.priceRange.min.toLocaleString()} - {restaurant.priceRange.max.toLocaleString()}
              </span>
            )}
          </div>

          {/* ========== MAPS BUTTON ========== */}
          {hasLocation ? (
            <>
              <button 
                className="map-toggle-btn" 
                onClick={toggleMap}
              >
                <MapPin size={16} />
                {showMap ? "Tutup Peta" : "Lihat di Peta"}
              </button>

              {showMap && (
                <div className="maps-section" ref={mapRef}>
                  <div className="map-container">
                    <iframe
                      className="map-iframe"
                      src={mapsUrl}
                      loading="lazy"
                      title="Google Maps"
                      allowFullScreen
                    />
                  </div>

                  <div className="maps-buttons">
                    <button className="map-btn open-maps" onClick={openGoogleMapsSearch}>
                      <MapPin size={16} />
                      Buka di Maps
                    </button>
                    <button className="map-btn directions" onClick={getDirections}>
                      <ExternalLink size={16} />
                      Petunjuk Arah
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button 
              className="location-not-available-btn"
              onClick={openGoogleMapsSearch}
            >
              <MapPin size={20} />
              <div>
                <p className="btn-title">Klik untuk berpindah ke Google Maps</p>
              </div>
              <ExternalLink size={18} className="btn-icon" />
            </button>
          )}

          {/* ========== INFORMASI TAMBAHAN ========== */}
          <div className="additional-info">
            {/* Jam Buka */}
            <div className="info-card">
              <div className="info-icon">
                <Clock size={20} />
              </div>
              <div className="info-content">
                <p className="info-label">Jam Operasional</p>
                <p className="info-value">{getOperatingHours()}</p>
              </div>
            </div>

            {/* Kisaran Harga */}
            {restaurant.priceRange && (
              <div className="info-card">
                <div className="info-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-content">
                  <p className="info-label">Kisaran Harga</p>
                  <p className="info-value">
                    Rp {restaurant.priceRange.min.toLocaleString()} - Rp {restaurant.priceRange.max.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Kontak (jika ada) */}
            {restaurant.phone && (
              <div className="info-card clickable" onClick={() => window.open(`tel:${restaurant.phone}`)}>
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <p className="info-label">Kontak</p>
                  <p className="info-value">{restaurant.phone}</p>
                </div>
                <ExternalLink size={16} className="info-arrow" />
              </div>
            )}

            {/* Website (jika ada) */}
            {restaurant.website && (
              <div className="info-card clickable" onClick={() => window.open(restaurant.website, "_blank")}>
                <div className="info-icon">
                  <Globe size={20} />
                </div>
                <div className="info-content">
                  <p className="info-label">Website</p>
                  <p className="info-value">Kunjungi Website</p>
                </div>
                <ExternalLink size={16} className="info-arrow" />
              </div>
            )}
          </div>

          {/* ========== DESKRIPSI ========== */}
          <div className="description-section">
            <h3 className="section-title">Tentang Restoran</h3>
            <p className="description-text">
              {restaurant.name} adalah restoran yang menyajikan berbagai menu {restaurant.specialty || "Aneka Makanan"} dengan cita rasa yang lezat. 
              Terletak di {restaurant.address}, restoran ini mudah dijangkau dan menjadi pilihan favorit bagi pecinta kuliner di sekitar area.
            </p>
            <p className="description-text">
              Dengan rating <strong>{restaurant.rating || "-"}/5</strong>, restoran ini telah dipercaya oleh banyak pelanggan 
              dan terus berkomitmen memberikan pelayanan terbaik.
            </p>
          </div>

          {/* ========== FASILITAS ========== */}
          <div className="facilities-section">
            <h3 className="section-title">Fasilitas</h3>
            <div className="facilities-grid">
              <div className="facility-item">🍽️ Dine-in</div>
              <div className="facility-item">🥡 Take Away</div>
              <div className="facility-item">🚗 Parkir</div>
              <div className="facility-item">🧼 Toilet</div>
              <div className="facility-item">💳 Non-Tunai</div>
              <div className="facility-item">📶 WiFi</div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar active="home" />
    </div>
  );
}