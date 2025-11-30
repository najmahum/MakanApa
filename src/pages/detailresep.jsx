import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Untuk ambil ID dari URL
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/detailresep.css";

const DetailResep = () => {
  const { id } = useParams(); // Ambil ID resep misal /resep/1

  // NANTI: const [resep, setResep] = useState(null);
  // SEKARANG: Kita pakai data dummy dulu biar UI-nya jadi
  const resepData = {
    id: 1,
    title: "Nasi Goreng Kampung",
    image: "https://images.unsplash.com/photo-1603133872878-684f57da0498?q=80&w=1000&auto=format&fit=crop",
    waktu: 15,
    porsi: 1,
    bahan: [
      "1 piring nasi putih",
      "1 butir telur ayam",
      "1 ikat sawi hijau (potong-potong)",
      "1 buah tomat (potong-potong)",
      "2 siung bawang merah (iris tipis)",
      "1 siung bawang putih (iris tipis)",
      "1 sdm kecap manis",
      "1/2 sdt garam",
      "Minyak goreng secukupnya"
    ],
    langkah: [
      "Panaskan minyak di wajan, ceplok 1 butir telur, angkat dan sisihkan.",
      "Tumis bawang merah dan bawang putih hingga harum.",
      "Masukkan tomat cincang, aduk hingga agak layu.",
      "Tambahkan nasi putih, aduk rata dengan bumbu tumisan.",
      "Masukkan potongan sawi, beri garam, kaldu bubuk, dan kecap manis, aduk rata.",
      "Sajikan nasi goreng di piring."
    ]
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Header title={resepData.title} backLink="/hasilresep" />
      </div>

      {/* Area Scroll */}
      <div className="content-scroll">
        
        {/* Gambar Utama */}
        <div className="hero-image">
          <img src={resepData.image} alt={resepData.title} />
        </div>

        {/* Info Waktu & Porsi (Card Kecil) */}
        <div className="info-card">
          <div className="info-item">
            <strong>Waktu masak:</strong> {resepData.waktu} Menit
          </div>
          <div className="info-item">
            <strong>Porsi:</strong> {resepData.porsi} Orang
          </div>
        </div>

        {/* Card Bahan Utama */}
        <div className="content-card">
          <h3>Bahan Utama:</h3>
          <ul>
            {resepData.bahan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Card Langkah Memasak */}
        <div className="content-card">
          <h3>Langkah Memasak:</h3>
          <ul className="step-list">
            {resepData.langkah.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Spacer buat Navbar */}
        <div className="spacer-navbar"></div>
      </div>

      <Navbar />
    </div>
  );
};

export default DetailResep;