import React, { useState} from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Tambah useLocation
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/tambahresep.css";
import AddDocIcon from "../assets/icons/addfile.svg"; 

const TambahResep = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Panggil hook ini

  // 3. AMBIL DATA DARI STATE (Kiriman dari tombol Edit di DetailResep)
  const { isEdit, resepData } = location.state || {};

  // 4. ISI STATE AWAL
  // Kalau isEdit true, isi pakai data lama. Kalau tidak, kosongi.
  const [basicInfo, setBasicInfo] = useState({
    namaResep: isEdit ? resepData.nama_resep : "",
    deskripsi: isEdit ? resepData.deskripsi : "",
    image: isEdit ? resepData.gambar : ""
  });

  const handleChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!basicInfo.namaResep) {
        alert("Nama resep wajib diisi!");
        return;
    }

    // 5. NAVIGASI KE FILE KEDUA (Bawa Data Lebih Lengkap)
    navigate("/tambah-resep-detail", { 
        state: { 
            dataAwal: basicInfo,             // Data yang barusan diedit/diisi user
            isEdit: isEdit,                  // Status: lagi edit atau baru?
            resepId: isEdit ? resepData.id_resep : null, // ID Resep (PENTING buat Update ke DB)
            oldData: isEdit ? resepData : null // Data lama (buat ngisi bahan/langkah di step 2)
        } 
    });
  };

  return (
    <div className="tambah-resep-container">
      {/* 6. UBAH JUDUL HEADER JADI DINAMIS */}
      <Header title={isEdit ? "Edit Resep" : "Tambah Resep"} backLink="/resepku" />

      <div className="form-content">
        <div className="form-group-box">
          <label>Nama Resep</label>
          <input 
            type="text" 
            name="namaResep" 
            className="input-box-red" 
            placeholder="Masukkan disini" 
            value={basicInfo.namaResep} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group-box">
          <label>Deskripsi</label>
          <input 
            type="text" 
            name="deskripsi" 
            className="input-box-red" 
            placeholder="Masukkan disini" 
            value={basicInfo.deskripsi} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group-box">
          <label>Link Gambar Masakan</label>
          <input 
            type="text" 
            name="image" 
            className="input-box-red" 
            placeholder="Masukkan disini" 
            value={basicInfo.image} 
            onChange={handleChange}
          />
          <p className="hint-text">* Masukkan link gambar dari browser (rekomendasi: copy image address)</p>
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