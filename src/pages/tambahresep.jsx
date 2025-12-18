import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/tambahresep.css";

// Import Assets
import AddDocIcon from "../assets/icons/addfile.svg"; 

const TambahResep = () => {
  const navigate = useNavigate();
  
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
    // NAVIGASI KE FILE KEDUA (Bawa Data)
    navigate("/tambah-resep-detail", { state: { dataAwal: basicInfo } });
  };

  return (
    <div className="tambah-resep-container">
      <Header title="Tambah Resep" backLink="/Home" />

      <div className="form-content">
        <div className="form-group-box">
          <label>Nama Resep</label>
          <input type="text" name="namaResep" className="input-box-red" placeholder="Masukkan disini" value={basicInfo.namaResep} onChange={handleChange}/>
        </div>

        <div className="form-group-box">
          <label>Deskripsi</label>
          <input type="text" name="deskripsi" className="input-box-red" placeholder="Masukkan disini" value={basicInfo.deskripsi} onChange={handleChange}/>
        </div>

        <div className="form-group-box">
          <label>Link Gambar Masakan</label>
          <input type="text" name="image" className="input-box-red" placeholder="Masukkan disini" value={basicInfo.image} onChange={handleChange}/>
          <p className="hint-text">* Masukkan link gambar dari browser dengan format "link.jpg" atau "link.png"</p>
        </div>

        <button className="btn-next-big" onClick={handleNext}>
           <img src={AddDocIcon} alt="" className="btn-icon" /> 
           SELANJUTNYA
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default TambahResep;