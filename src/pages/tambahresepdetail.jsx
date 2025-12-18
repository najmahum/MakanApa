import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi"; 
import "../styles/tambahresep.css";

// Import Assets
import AddDocIcon from "../assets/icons/addfile.svg";

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

  const [tempBahan, setTempBahan] = useState({ nama: "", jumlah: 1, satuan: "Butir" });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LOGIC BAHAN ---
  const handleTambahBahan = () => {
    if (!tempBahan.nama) return;
    setDetails({
      ...details,
      bahan: [...details.bahan, { ...tempBahan, id: Date.now() }]
    });
    setTempBahan({ nama: "", jumlah: 1, satuan: "Butir" }); // Reset
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
    // Format bahan jadi array string (sesuai kebutuhan backend)
    // "Telur 2 Butir"
    const bahanFormatted = details.bahan.map(b => `${b.nama} ${b.jumlah} ${b.satuan}`);

    const finalData = {
        nama_resep: dataAwal.namaResep,
        deskripsi: dataAwal.deskripsi,
        gambar: dataAwal.image,
        porsi: details.porsi,
        durasi: details.durasi,
        bahan: bahanFormatted,
        langkah: details.langkah
    };

    try {
        setLoading(true);
        await Integrasi.post("/api/resep/add", finalData); // Sesuaikan endpoint
        setShowSuccessModal(true);
    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan resep.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="tambah-resep-container">
      <Header title="Tambah Resep" backLink="/tambah-resep" />

      <div className="form-content">
        
        {/* ROW 1: PORSI & DURASI */}
        <div className="row-dua">
            <div className="form-group-box half">
                <label>Porsi</label>
                <div className="counter-box">
                    <button onClick={() => setDetails(prev => ({...prev, porsi: Math.max(1, prev.porsi - 1)}))}>−</button>
                    <span>{details.porsi}</span>
                    <button onClick={() => setDetails(prev => ({...prev, porsi: prev.porsi + 1}))}>+</button>
                </div>
            </div>
            <div className="form-group-box half">
                <label>Durasi memasak</label>
                <div className="duration-box">
                    <input type="number" placeholder="0" value={details.durasi} onChange={(e)=>setDetails({...details, durasi: e.target.value})}/>
                    <span>Menit</span>
                </div>
            </div>
        </div>

        {/* BOX INPUT BAHAN (KOTAK MERAH) */}
        <div className="section-label">Bahan-bahan</div>
        <div className="ingredient-form-box">
            {/* Input Nama */}
            <div className="ing-row">
                <label>Nama Bahan</label>
                <input 
                    type="text" 
                    className="ing-input-line" 
                    placeholder="Masukkan Disini" 
                    value={tempBahan.nama}
                    onChange={(e) => setTempBahan({...tempBahan, nama: e.target.value})}
                />
            </div>
            
            {/* Input Jumlah & Satuan */}
            <div className="ing-row-bottom">
                <div className="qty-group">
                    <label>Jumlah</label>
                    <div className="mini-counter">
                            <button onClick={() => setTempBahan({...tempBahan, jumlah: Math.max(1, tempBahan.jumlah - 1)})}>−</button>
                            <span>{tempBahan.jumlah}</span>
                            <button onClick={() => setTempBahan({...tempBahan, jumlah: tempBahan.jumlah + 1})}>+</button>
                    </div>
                </div>

                <div className="unit-group">
                    <label>Satuan</label>
                    <select 
                        value={tempBahan.satuan} 
                        onChange={(e) => setTempBahan({...tempBahan, satuan: e.target.value})}
                        className="unit-select"
                    >
                        <option value="Butir">Butir</option>
                        <option value="Ikat">Ikat</option>
                        <option value="Gram">Gram</option>
                        <option value="Sdm">Sdm</option>
                        <option value="Pcs">Pcs</option>
                    </select>
                </div>

                <button className="btn-small-pill" onClick={handleTambahBahan}>
                    + Tambah
                </button>
            </div>
        </div>

        {/* LIST DAFTAR BAHAN */}
        <div className="list-title">Daftar Bahan Kamu</div>
        <div className="ingredients-list">
            {details.bahan.map((item) => (
                <div className="ing-item-card" key={item.id}>
                    <span className="ing-name">{item.nama}</span>
                    <span className="ing-qty">{item.jumlah} {item.satuan}</span>
                    <span className="btn-remove-x" onClick={() => handleHapusBahan(item.id)}>✕</span>
                </div>
            ))}
        </div>

        {/* LANGKAH MEMASAK */}
        <div className="section-label mt-20">Resep <span style={{fontWeight:'normal'}}>(Langkah-Langkah)</span></div>
        <div className="steps-container">
            {details.langkah.map((step, idx) => (
                <div className="step-row" key={idx}>
                    <label>Step {idx+1}</label>
                    <input 
                        type="text" 
                        className="input-box-red" 
                        placeholder="Masukkan disini" 
                        value={step} 
                        onChange={(e)=>handleLangkahChange(idx, e.target.value)} 
                    />
                </div>
            ))}
        </div>
        <button className="btn-small-pill-long" onClick={() => setDetails({...details, langkah: [...details.langkah, ""]})}>
            + Tambah step
        </button>

        {/* TOMBOL SIMPAN */}
        <button className="btn-next-big" onClick={handleSubmit} disabled={loading}>
            <img src={AddDocIcon} alt="" className="btn-icon" /> 
            {loading ? "MEMPROSES..." : "TAMBAH RESEP"}
        </button>
      </div>

      <Navbar />

      {/* === LAYAR SUKSES (FULL SCREEN OVERLAY) === */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="modal-content-center">
                <h3 className="title-center">Tambah Resep</h3>
                <div className="success-body">
                    <h3>Resep kamu berhasil diajukan!</h3>
                    <p>Tunggu konfirmasi dari admin agar resep kamu dapat dipublikasikan</p>
                    <button className="btn-pill-red" onClick={() => navigate("/resep-kamu")}>
                        Kembali ke Halaman Resep
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default TambahResepDetail;