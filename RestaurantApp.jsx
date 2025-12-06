// src/pages/RestaurantApp.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar.jsx";
import "../styles/RestaurantApp.css";

export default function RestaurantApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query = "", harga = "", jarak = "", rating = "" } = location.state || {};

  const [searchQuery] = useState(query);
  const [selectedHarga] = useState(harga);
  const [selectedJarak] = useState(jarak);
  const [selectedRating] = useState(rating);

  const restaurants = [
    {
      id: 1,
      name: "Warmindo Pak Yanto",
      address: "Jl. Srigunting Raya No. 12, Jebres",
      specialty: "Aneka nasi, Bakmie",
      rating: 4.9,
      distance: 0.9,
      priceRange: { min: 10000, max: 20000 },
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      menu: [
        { name: "Nasi Goreng Spesial", price: 15000 },
        { name: "Bakmie Ayam", price: 12000 },
        { name: "Teh Manis", price: 5000 },
      ],
    },
    {
      id: 2,
      name: "Kantin Ceria",
      address: "Jl. Cendrawasih Lor No. 17B, Jebres",
      specialty: "Aneka nasi, Jajanan",
      rating: 4.7,
      distance: 1.4,
      priceRange: { min: 10000, max: 25000 },
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      menu: [
        { name: "Nasi Ayam Goreng", price: 18000 },
        { name: "Bakso", price: 12000 },
      ],
    },
  ];

  // Filter otomatis sesuai search
  const filteredRestaurants = restaurants.filter((r) => {
    let hargaCond = true;
    if (selectedHarga)
      hargaCond =
        r.priceRange.min >= parseInt(selectedHarga.min) &&
        r.priceRange.max <= parseInt(selectedHarga.max);

    let jarakCond = true;
    if (selectedJarak === "1") jarakCond = r.distance < 1;
    else if (selectedJarak === "2") jarakCond = r.distance >= 1 && r.distance <= 3;
    else if (selectedJarak === "3") jarakCond = r.distance > 3;

    let ratingCond = selectedRating ? r.rating >= parseInt(selectedRating) : true;
    let queryCond = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return hargaCond && jarakCond && ratingCond && queryCond;
  });

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={handleBack}>
          <span className="back-circle">
            <ArrowLeft size={22} />
          </span>
        </button>
        <h1 className="header-title">Rekomendasi Tempat Makan</h1>
      </header>

      {/* Location Bar */}
      <div className="location-bar">
        Lokasi Anda: Jl. Srigunting Raya No.30, Jebres
      </div>

      {/* Search Summary */}
      <div className="search-section">
        <div className="search-box-display">{searchQuery || "Nasi Goreng"}</div>
        <div className="filter-info">
          {selectedHarga && (
            <span>
              Harga: Rp {selectedHarga.min} - {selectedHarga.max}
            </span>
          )}
          {selectedJarak && (
            <span>
              Jarak:{" "}
              {selectedJarak === "1"
                ? "< 1 km"
                : selectedJarak === "2"
                ? "1 - 3 km"
                : "> 3 km"}
            </span>
          )}
          {selectedRating && <span>Rating: ≥ {selectedRating} ⭐</span>}
        </div>
        <p className="result-info">
          Ditemukan <strong>{filteredRestaurants.length}</strong> restoran sesuai
          pencarian.
        </p>
      </div>

      {/* List Restoran */}
      <div className="restaurant-list">
        {filteredRestaurants.map((r) => (
          <div
            key={r.id}
            className="restaurant-card"
            onClick={() => navigate("/detail", { state: r })}   // ← DITAMBAHKAN
          >
            <img src={r.image} alt={r.name} className="restaurant-img" />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="specialty-text">{r.specialty}</p>
              <p className="address-text">{r.address}</p>
              <div className="restaurant-meta">
                <span className="rating">
                  <Star size={14} fill="#fff" /> {r.rating}
                </span>
                <span className="distance">{r.distance} km</span>
                <span className="price">
                  Rp {r.priceRange.min} - {r.priceRange.max}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Navbar */}
      <Navbar active="home" />
    </div>
  );
}
