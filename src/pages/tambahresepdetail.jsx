import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import api from "../utils/api"; 
import "../styles/tambahresep.css";

// Import Assets
import AddFileIcon from "../assets/icons/add-file.svg";
import CheckCircle from "../assets/icons/check.svg"; // Icon Centang buat Popup

const TambahResepDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil Data dari Step 1
  const dataAwal = location.state?.dataAwal || {};

  // State Step 2
  const [details, setDetails] = useState({
    porsi: 1,
    durasi: "",
    bahan: [],
    langkah: [""] 
  });

  // State Input Kecil (Bahan)
  const [tempBahan, setTempBahan] = useState({ nama: "", jumlah: "", satuan: "Butir" });
  
  // State Popup Sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LOGIC BAHAN ---
  const handleTambahBahan = () => {
    if (!tempBahan.nama) return;
    setDetails({
      ...details,
      bahan: [...details.bahan, { ...tempBahan, id: Date.now() }]
    });
    setTempBahan({ nama: "", jumlah: "", satuan: "Butir" });
  };

  const handleHapusBahan = (id) => {
    setDetails({ ...details, bahan: details.bahan.filter(b => b.id !== id) });
  };

  // --- LOGIC LANGKAH ---
  const handleLangkahChange = (index, val) => {
    const newSteps = [...details.langkah];
    newSteps[index] = val;
    setDetails({ ...details, langkah: newSteps });
  };

  // --- SUBMIT FINAL ---
  const handleSubmit = async () => {
    // Gabungkan Data Step 1 + Step 2
    const finalData = {
        ...dataAwal,
        ...details
    };

    try {
        await api.post("/api/resep/tambah", finalData);
        // SUKSES -> Munculin Popup
        setShowSuccessModal(true);
    } catch (error) {
        alert("Gagal menyimpan resep.");
    }
  };

  return (
    <div className="tambah-resep-container">
      <Header title="Tambah Resep" backLink="/tambah-resep" />

      <div className="form-content">
        
        {/* Input Porsi & Durasi */}
        <div className="row-inputs">
            <div className="form-group-red half">
            <label>Porsi</label>
            <div className="stepper-box">
                <button onClick={() => setDetails(prev => ({...prev, porsi: Math.max(1, prev.porsi - 1)}))}>-</button>
                <span>{details.porsi}</span>
                <button onClick={() => setDetails(prev => ({...prev, porsi: prev.porsi + 1}))}>+</button>
            </div>
            </div>
            <div className="form-group-red half">
            <label>Durasi (Menit)</label>
            <div className="duration-box">
                <input type="number" placeholder="0" value={details.durasi} onChange={(e)=>setDetails({...details, durasi: e.target.value})}/>
            </div>
            </div>
        </div>

        {/* Box Bahan (Sama kayak sebelumnya) */}
        <div className="box-ingredients">
            <label className="box-label">Bahan-bahan</label>
            <div className="input-ingredient-row">
                <input className="ing-input" type="text" placeholder="Nama Bahan" value={tempBahan.nama} onChange={(e)=>setTempBahan({...tempBahan, nama: e.target.value})} />
                <button className="btn-add-small" onClick={handleTambahBahan}>+ Tambah</button>
            </div>
            
            {/* List Bahan */}
            <div className="added-ingredients-list">
                {details.bahan.map((item) => (
                    <div className="ing-item" key={item.id}>
                        <span>{item.nama} - {item.jumlah} {item.satuan}</span>
                        <button className="del-btn" onClick={() => handleHapusBahan(item.id)}>✕</button>
                    </div>
                ))}
            </div>
        </div>

        {/* Langkah Memasak */}
        <div className="steps-section">
            <label className="box-label">Langkah Memasak</label>
            {details.langkah.map((step, idx) => (
                <div className="step-input" key={idx}>
                    <span>Step {idx+1}</span>
                    <input type="text" value={step} onChange={(e)=>handleLangkahChange(idx, e.target.value)} />
                </div>
            ))}
            <button className="btn-add-step" onClick={() => setDetails({...details, langkah: [...details.langkah, ""]})}>
                + Tambah Step
            </button>
        </div>

        {/* Tombol Simpan */}
        <button className="btn-big-red-bottom" onClick={handleSubmit}>
            <img src={AddFileIcon} alt="" /> TAMBAH RESEP
        </button>
      </div>

      <Navbar />

      {/* === POPUP SUKSES (MODAL) === */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="modal-card">
                {/* Ganti icon centang kalau ada */}
                <h3 style={{color: '#FF5858'}}>Berhasil!</h3>
                <p className="modal-desc">
                    Resep kamu berhasil diajukan!<br/>
                    Tunggu konfirmasi dari admin agar resep kamu dapat dipublikasi.
                </p>
                <button className="btn-outline-red" onClick={() => navigate("/resep-ku")}>
                    Kembali ke Halaman Resep
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default TambahResepDetail;