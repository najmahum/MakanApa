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
  
  // 1. AMBIL DATA DARI STEP 1 (Termasuk isEdit, resepId, oldData)
  const { dataAwal, isEdit, resepId, oldData } = location.state || {};

  // --- HELPER 1: PARSE LIST (JSON atau Strip) ---
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data; 
    if (typeof data === 'string' && data.trim().startsWith('[')) {
        try { return JSON.parse(data.replace(/'/g, '"')); } catch(e){}
    }
    return typeof data === 'string' ? data.split('--') : [data];
  };

  // --- HELPER 2: PARSE BAHAN STRING KE OBJECT (LOGIC SULIT) ---
  // Mengubah "Bawang Merah 5 Siung" menjadi { nama: "Bawang Merah", jumlah: "5", satuan: "Siung" }
  const parseBahanToObj = (strBahan) => {
     const parts = strBahan.split(" ");
     // Minimal harus ada 3 bagian: "Nama" "Jumlah" "Satuan"
     if(parts.length >= 2) {
         const satuan = parts.pop(); // Ambil paling belakang
         const jumlah = parts.pop(); // Ambil depannya lagi
         const nama = parts.join(" "); // Sisanya adalah nama
         return { id: Date.now() + Math.random(), nama, jumlah, satuan };
     }
     // Fallback kalau formatnya aneh
     return { id: Date.now() + Math.random(), nama: strBahan, jumlah: "1", satuan: "pcs" };
  };

  const satuanOptions = [
    { label: "Gram (gr)", value: "gram" },
    { label: "Kilogram (kg)", value: "kg" },
    { label: "Mililiter (ml)", value: "ml" },
    { label: "Liter (l)", value: "liter" },
    { label: "Gelas", value: "gelas" },
    { label: "Sendok Makan (sdm)", value: "sdm" },
    { label: "Sendok Teh (sdt)", value: "sdt" },
    { label: "Butir", value: "butir" },
    { label: "Buah", value: "buah" },
    { label: "Siung", value: "siung" },
    { label: "Ekor", value: "ekor" },
    { label: "Pcs", value: "pcs" },
    { label: "Batang", value: "batang" },
    { label: "Ikat", value: "ikat" },
    { label: "Lembar", value: "lembar" },
    { label: "Ruas", value: "ruas" },
    { label: "Bungkus", value: "bungkus" },
    { label: "Secukupnya", value: "secukupnya" },
  ];

  // 2. STATE STEP 2 (ISI DENGAN DATA LAMA JIKA EDIT)
  const [details, setDetails] = useState({
    porsi: isEdit ? oldData.porsi : 1,
    durasi: isEdit ? oldData.durasi : "",
    bahan: isEdit ? parseList(oldData.bahan).map(b => parseBahanToObj(b)) : [],
    langkah: isEdit ? parseList(oldData.langkah) : [""] 
  });

  const [tempBahan, setTempBahan] = useState({ nama: "", jumlah: "1", satuan: "gram" });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateJumlah = (increment) => {
    let currentVal = parseFloat(tempBahan.jumlah);
    if (isNaN(currentVal)) currentVal = 0;
    let newVal = currentVal + increment;
    if (newVal < 0) newVal = 0;
    setTempBahan({ ...tempBahan, jumlah: String(newVal) });
  };

  const handleTambahBahan = () => {
    if (!tempBahan.nama) return;
    setDetails({
      ...details,
      bahan: [...details.bahan, { ...tempBahan, id: Date.now() }]
    });
    setTempBahan({ nama: "", jumlah: "1", satuan: "gram" }); 
  };

  const handleHapusBahan = (id) => {
    setDetails({ ...details, bahan: details.bahan.filter(b => b.id !== id) });
  };

  const handleLangkahChange = (index, val) => {
    const newSteps = [...details.langkah];
    newSteps[index] = val;
    setDetails({ ...details, langkah: newSteps });
  };
  const handleHapusLangkah = (index) => {
    const newSteps = details.langkah.filter((_, i) => i !== index);
    setDetails({ ...details, langkah: newSteps });
  };
  // 3. SUBMIT (BISA POST ATAU PUT)
  const handleSubmit = async () => {
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
        
        if (isEdit) {
            // === JALUR UPDATE (PUT) ===
            await Integrasi.put(`/api/tambahresep/edit/${resepId}`, finalData);
        } else {
            // === JALUR BARU (POST) ===
            await Integrasi.post("/api/tambahresep/tambah", finalData);
        }

        setShowSuccessModal(true);
    } catch (error) {
        console.error(error);
        alert(isEdit ? "Gagal update resep." : "Gagal menyimpan resep.");
    } finally {
        setLoading(false);
    }
  };

  // Judul Modal Berbeda Tergantung Edit/Baru
  const modalTitle = isEdit ? "Resep berhasil diperbarui!" : "Resep kamu berhasil diajukan!";
  const modalDesc = isEdit 
    ? "Perubahan resepmu akan direview ulang oleh admin." 
    : "Tunggu konfirmasi dari admin agar resep kamu dapat dipublikasikan";

  return (
    <div className="tambah-resep-container">
      <Header title={isEdit ? "Edit Detail" : "Tambah Resep"} backLink="/tambah-resep" />

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

        {/* BOX INPUT BAHAN */}
        <div className="section-label">Bahan-bahan</div>
        <div className="ingredient-form-box">
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
            
            <div className="ing-row-bottom">
                <div className="qty-group">
                    <label>Jumlah</label>
                    <div className="mini-counter">
                            <button onClick={() => updateJumlah(-1)}>−</button>
                            <input 
                                type="text" 
                                value={tempBahan.jumlah} 
                                onChange={(e) => setTempBahan({...tempBahan, jumlah: e.target.value})}
                                style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none', background: 'transparent', fontWeight: 'bold' }}
                            />
                            <button onClick={() => updateJumlah(1)}>+</button>
                    </div>
                </div>

                <div className="unit-group">
                    <label>Satuan</label>
                    <select 
                        value={tempBahan.satuan} 
                        onChange={(e) => setTempBahan({...tempBahan, satuan: e.target.value})}
                        className="unit-select"
                    >
                        {satuanOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
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
                    {details.langkah.length > 1 && (
                        <span className="btn-remove-step" onClick={() => handleHapusLangkah(idx)}>✕</span>
                    )}
                </div>
            ))}
        </div>
        <button className="btn-small-pill-long" onClick={() => setDetails({...details, langkah: [...details.langkah, ""]})}>
            + Tambah step
        </button>

        {/* TOMBOL SIMPAN */}
        <button className="btn-next-big" onClick={handleSubmit} disabled={loading}>
            <img src={AddDocIcon} alt="" className="btn-icon" /> 
            {loading ? "MEMPROSES..." : (isEdit ? "SIMPAN PERUBAHAN" : "TAMBAH RESEP")}
        </button>
      </div>

      <Navbar />

      {/* === LAYAR SUKSES === */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="modal-content-center">
                <div className="success-body">
                    <h3>{modalTitle}</h3>
                    <p>{modalDesc}</p>
                    <button className="btn-pill-red" onClick={() => navigate("/resepku")}>
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