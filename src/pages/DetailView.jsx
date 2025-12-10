import React, { useState } from "react";
import "../styles/DetailView.css"; 
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import Navbar from "../components/navbar.jsx";

export default function DetailView() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const [showMap, setShowMap] = useState(false);

  const selectedRestaurant = {
    id: 1,
    name: "Warmindo Pak Yanto",
    address: "Jl. Srigunting Raya No. 12, Jebres",
    specialty: "Aneka nasi, Bakmie",
    rating: 4.9,
    distance: 0.9,
    priceRange: { min: 10000, max: 20000 },
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    lat: -7.5568,
    lng: 110.8241,
    menu: [
      {
        name: "Nasi Goreng Spesial",
        price: 15000,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop"
      },
      {
        name: "Bakmie Ayam",
        price: 12000,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop"
      },
      {
        name: "Teh Manis",
        price: 5000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop"
      }
    ]
  };

  const mapsUrlSimple = `https://www.google.com/maps?q=${selectedRestaurant.lat},${selectedRestaurant.lng}&output=embed`;

  return (
    <div className="container-app">

      {/* Back Button */}
      <button className="btn-back" onClick={handleBack}>
        <span className="back-circle">
          <ArrowLeft size={22} />
        </span>
      </button>

      {/* Header Image */}
      <div className="header-image-wrapper">
        <img className="header-image" src={selectedRestaurant.image} alt={selectedRestaurant.name} />
        <div className="header-overlay"></div>
        <h1 className="restaurant-title">{selectedRestaurant.name}</h1>
      </div>

      {/* Content */}
      <div className="content">

        <div className="info-section">
          <p className="specialty">{selectedRestaurant.specialty}</p>
          <p className="address">{selectedRestaurant.address}</p>

          <div className="meta-info">
            <span className="meta-badge"><Star size={14} fill="#fff" /> {selectedRestaurant.rating}</span>
            <span className="meta-badge">{selectedRestaurant.distance} km</span>
            <span className="meta-badge">
              Rp {selectedRestaurant.priceRange.min.toLocaleString()} - {selectedRestaurant.priceRange.max.toLocaleString()}
            </span>
          </div>

          <button className="map-button" onClick={() => setShowMap(!showMap)}>
            <MapPin size={18} />
            {showMap ? "Sembunyikan Peta" : "Lihat di Peta"}
          </button>
        </div>

        {showMap && (
          <div className="map-container">
            <iframe className="map-iframe" src={mapsUrlSimple} loading="lazy" />
          </div>
        )}

        <div className="menu-section">
          <h2 className="menu-title">Menu Tersedia</h2>

          <div className="menu-grid">
            {selectedRestaurant.menu.map((item, i) => (
              <div className="menu-card" key={i}>
                <div className="menu-image-container">
                  <img src={item.image} alt={item.name} className="menu-image" />
                </div>
                <h3 className="menu-name">{item.name}</h3>
                <p className="menu-price">Rp {item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar active="home" />
    </div>
  );
}
