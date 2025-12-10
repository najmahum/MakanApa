import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/masukanbahan.css";
import Header from "../components/header";
import ChefHat from "../assets/icons/chefhat.svg";
import Tambah from "../assets/icons/tambah.svg";
import Integrasi from "../config/integrasi"; // Pastikan path ini benar

const InputBahan = () => {
  const navigate = useNavigate();
  
  // State
  const [namaBahan, setNamaBahan] = useState("");
  const [satuan, setSatuan] = useState("gram");
  const [jumlah, setJumlah] = useState(1);
  const [listBahan, setListBahan] = useState(() => {
    const savedBahan = sessionStorage.getItem("draftBahan");
    if (savedBahan) {
      return JSON.parse(savedBahan);
    } else {
      return [];
    }
  });

  // Effect Simpan Draft
  useEffect(() => {
    sessionStorage.setItem("draftBahan", JSON.stringify(listBahan));
  }, [listBahan]);
  
  const satuanOptions = ["gram", "kg", "ml", "liter", "ikat", "buah", "butir"];

  const tambahJumlah = () => setJumlah((prev) => prev + 1);
  const kurangJumlah = () => jumlah > 1 && setJumlah((prev) => prev - 1);
  
  const InputManual = (e) => {
    const val = parseInt(e.target.value); 
    setJumlah(isNaN(val) ? 0 : val);
  };

  const handleTambahBahan = () => {
    if(namaBahan.trim() === "" || jumlah <= 0) return;
    const bahanBaru = {
      id: Date.now(),
      nama: namaBahan,
      jumlah: jumlah,
      satuan: satuan || "Pcs"
    };
    setListBahan([...listBahan, bahanBaru]);
    setNamaBahan("");
    setJumlah(1);
  };

  const handleHapusBahan = (id) => {
    setListBahan(listBahan.filter(item => item.id !== id));
  };

  const handleCariResep = async () => {
    if (listBahan.length === 0) {
      alert("Masukkan minimal satu bahan dulu!");
      return;
    }
    
    try {
      const response = await Integrasi.post("/api/resep/resep/cari", {
        bahanList: listBahan
      });
      
      console.log("Hasil Cari Resep:", response.data);
      
      // Pindah ke Hasil Resep bawa data
      navigate("/hasilresep", { state: { hasil: response.data } });

    } catch (error) {
      console.error("Error cari resep:", error);
      if(error.response) {
          alert(`Gagal: ${error.response.data.error || "Terjadi kesalahan di server."}`);
      } else {
          alert("Gagal mencari resep, cek koneksi backend.");
      }
    }
  };

  return (
    <div className="bahan-container">
      <div className="fixed-top-section">
        <Header title="Masukkan Bahan yang Kamu Miliki" backLink={"/home"} />
        
        <div className="input-card">
          <div className="form-group">
            <label>Nama Bahan</label>
            <input type="text" placeholder="Masukkan Disini" value={namaBahan} onChange={(e) => setNamaBahan(e.target.value)}/>
          </div>

          <div className="input-satuan">
            <div className="wrapper-kecil">
              <label>Jumlah</label>
              <div className="jumlah">
                <button onClick={kurangJumlah}>-</button>
                <input type="number" min="1" value={jumlah} onChange={InputManual} />
                <button onClick={tambahJumlah}>+</button>
              </div>
            </div>

            <div className="wrapper-kecil">
              <label>Satuan</label>
              <select className="pilih-satuan" value={satuan} onChange={(e) => setSatuan(e.target.value)}>
                <option value="">Pilih</option>
                {satuanOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>

            <div className="wrapper-tombol">
              <label style={{ visibility: "hidden" }}>Aksi</label>
              <button className="btn-tambah" onClick={handleTambahBahan}>
                 <img src={Tambah} alt="Tambah" style={{width: '14px', marginRight: '5px'}} />
                 Tambah
              </button>
            </div>
          </div>
        </div>

        <h3 style={{fontSize: '18px', color: '#666', margin: '10px 0'}}>Daftar Bahan Kamu</h3>
      </div>

      <div className="scroll-area">
        {listBahan.length === 0 ? (
          <p className="empty-state">Belum ada bahan.</p>
        ) : (
          listBahan.map((item) => (
            <div className="item-bahan" key={item.id}>
              <span className="nama">{item.nama}</span>
              <span className="info">{item.jumlah} {item.satuan}</span>
              <button className="hapus" onClick={() => handleHapusBahan(item.id)}>✕</button>
            </div>
          ))
        )}
      </div>

      <div className="fixed-bottom-section">
        <button className="tombol-cari" onClick={handleCariResep}>
          <img src={ChefHat} alt="ChefHat" />
          CARI RESEP
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default InputBahan;