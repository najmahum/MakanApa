import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/tambahresep.css"; // CSS gabungan

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
        <div className="form-group-red">
          <label>Nama Resep</label>
          <input type="text" name="namaResep" placeholder="Masukkan disini" value={basicInfo.namaResep} onChange={handleChange}/>
        </div>

        <div className="form-group-red">
          <label>Deskripsi</label>
          <textarea name="deskripsi" placeholder="Masukkan disini" rows="3" value={basicInfo.deskripsi} onChange={handleChange}/>
        </div>

        <div className="form-group-red">
          <label>Link Gambar Masakan</label>
          <input type="text" name="image" placeholder="Masukkan disini" value={basicInfo.image} onChange={handleChange}/>
          <p className="hint">* Masukkan link gambar (jpg/png)</p>
        </div>

        <button className="btn-big-red-bottom" onClick={handleNext}>
           SELANJUTNYA
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default TambahResep;