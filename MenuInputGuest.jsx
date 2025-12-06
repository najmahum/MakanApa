import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, Home, Heart, Folder, User, ArrowLeft } from "lucide-react";
import "../styles/MenuInputGuest.css";
import Navbar from "../components/navbar.jsx";

export default function MenuInputGuest() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHarga, setSelectedHarga] = useState(null);
  const [selectedJarak, setSelectedJarak] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const hargaOptions = [
    { label: "Rp 10.000 - Rp 30.000", value: { min: 10000, max: 30000 } },
    { label: "Rp 30.000 - Rp 60.000", value: { min: 30000, max: 60000 } },
    { label: "Rp 60.000+", value: { min: 60000, max: Infinity } },
  ];

  const jarakOptions = [
    { label: "< 1 km", value: 1 },
    { label: "1 - 3 km", value: 2 },
    { label: "> 3 km", value: 3 },
  ];

  const ratingOptions = [
    { label: "≥ 3 ⭐", value: 3 },
    { label: "≥ 4 ⭐", value: 4 },
    { label: "5 ⭐", value: 5 },
  ];

  // Navigasi ke RestaurantApp
  const handleSearch = () => {
    navigate("/restaurant", {
      state: {
        query: searchQuery,
        harga: selectedHarga,
        jarak: selectedJarak,
        rating: selectedRating,
      },
    });
  };

  const handleBack = () => navigate(-1);

  const isHargaSelected = (h) =>
    selectedHarga && selectedHarga.min === h.min && selectedHarga.max === h.max;

  return (
    <div className="guest-container">

      <div className="guest-inner">
        {/* Search box utama */}
        <div className="search-box">
          <Filter
            size={20}
            className="icon-left"
            onClick={() => setOpenFilter(true)}
          />
          <input
            type="text"
            placeholder="Makan Apa Yaaa?"
            className="input-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search size={20} className="icon-right" onClick={handleSearch} />
        </div>

        {/* Tombol back dengan background bulat */}
        <button className="btn-back" onClick={handleBack}>
            <span className="back-circle">
                <ArrowLeft size={22} />
            </span>
        </button>


        {/* Filter summary horizontal */}
        {(selectedHarga || selectedJarak || selectedRating) && (
          <div className="filter-summary">
            {selectedHarga && (
              <div className="filter-box-summary">
                Harga: Rp {selectedHarga.min.toLocaleString()} -{" "}
                {selectedHarga.max === Infinity ? "+" : selectedHarga.max.toLocaleString()}
              </div>
            )}
            {selectedJarak && (
              <div className="filter-box-summary">
                Jarak: {jarakOptions.find(j => j.value === selectedJarak)?.label}
              </div>
            )}
            {selectedRating && (
              <div className="filter-box-summary">
                Rating: ≥ {selectedRating} ⭐
              </div>
            )}
          </div>
        )}

        <button className="btn-search-food" onClick={handleSearch}>
          CARI TEMPAT MAKAN
        </button>
      </div>

      {/* Navbar komponen */}
      <Navbar active="home" />

      {/* Modal Filter */}
      {openFilter && (
        <div className="modal-overlay" onClick={() => setOpenFilter(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Filter Pencarian</h3>

            {/* HARGA */}
            <div className="filter-section">
              <label>Harga:</label>
              <div className="filter-box-group">
                {hargaOptions.map((item) => (
                  <div
                    key={item.label}
                    className={`filter-box ${isHargaSelected(item.value) ? "active" : ""}`}
                    onClick={() => setSelectedHarga(item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* JARAK */}
            <div className="filter-section">
              <label>Jarak:</label>
              <div className="filter-box-group">
                {jarakOptions.map((item) => (
                  <div
                    key={item.value}
                    className={`filter-box ${selectedJarak === item.value ? "active" : ""}`}
                    onClick={() => setSelectedJarak(item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* RATING */}
            <div className="filter-section">
              <label>Rating:</label>
              <div className="filter-box-group">
                {ratingOptions.map((item) => (
                  <div
                    key={item.value}
                    className={`filter-box ${selectedRating === item.value ? "active" : ""}`}
                    onClick={() => setSelectedRating(item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-apply-filter"
              onClick={() => setOpenFilter(false)}
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}