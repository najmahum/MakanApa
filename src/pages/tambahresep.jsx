import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/tambahresep.css";

const TambahResep = () => {
  const navigate = useNavigate();
  
  // State Step 1
  const [basicInfo, setBasicInfo] = useState({
    namaResep: "",
    deskripsi: "",
    image: ""
  });

  const handleChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!basicInfo.namaResep) {
        alert("Nama resep wajib diisi!");
        return;
    }
    // Pindah ke Page 2 Sambil Bawa Data
    navigate("/tambah-resep-detail", { state: { dataAwal: basicInfo } });
  };

  return (
    <div className="tambah-resep-container">
      <Header title="Tambah Resep" backLink="/resep-kamu" />

      <div className="form-content">
        {/* Input Nama Resep */}
        <div className="form-group-red">
          <label>Nama Resep</label>
          <input 
            type="text" 
            name="namaResep" 
            className="ing-input" /* <-- Pake class dari CSS kamu */
            placeholder="Masukkan disini" 
            value={basicInfo.namaResep} 
            onChange={handleChange}
          />
        </div>

        {/* Input Deskripsi */}
        <div className="form-group-red">
          <label>Deskripsi</label>
          <textarea 
            name="deskripsi" 
            className="ing-input" /* <-- Pake class dari CSS kamu */
            placeholder="Masukkan disini" 
            rows="3" 
            value={basicInfo.deskripsi} 
            onChange={handleChange}
            style={{resize: "none"}} // Opsional: biar rapi
          />
        </div>

        {/* Input Gambar */}
        <div className="form-group-red">
          <label>Link Gambar Masakan</label>
          <input 
            type="text" 
            name="image" 
            className="ing-input" /* <-- Pake class dari CSS kamu */
            placeholder="Masukkan disini" 
            value={basicInfo.image} 
            onChange={handleChange}
          />
          <p className="hint">* Masukkan link gambar (jpg/png)</p>
        </div>

        {/* Tombol Selanjutnya */}
        <button 
            className="btn-outline-red" /* <-- Pake class dari CSS kamu */
            onClick={handleNext}
            style={{ width: "100%", marginTop: "30px" }} /* Custom style dikit biar lebar */
        >
           SELANJUTNYA
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default TambahResep;