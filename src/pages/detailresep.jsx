import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi";
import "../styles/detailresep.css";

const DetailResep = () => {
  const { id } = useParams();
  const location = useLocation();

  const { isMyRecipe, status, feedback } = location.state || {};

  const [resep, setResep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true);
        const response = await Integrasi.get(`/api/resep/${id}`);
        // Backend Node biasanya mengembalikan { success: true, data: { ...detail } }
        setResep(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
        setError("Gagal memuat resep. Mungkin resep sudah dihapus atau koneksi bermasalah.");
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [id]);

  // Fungsi untuk memecah string langkah "step1--step2" menjadi array
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      return data.split('--').filter(item => item.trim() !== "");
    }
    return [data];
  };

  const backLink = isMyRecipe ? "/resep-kamu" : "/hasilresep";
  const pageTitle = resep?.nama_resep || "Detail Resep";

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Header title={pageTitle} backLink={backLink} />
      </div>

      <div className="content-scroll">
        {loading && (
          <div className="state-center">
            <p>Sedang memuat resep...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-center">
            <p style={{color: '#FF5858', textAlign: 'center', padding: '20px'}}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{marginTop: '10px', padding: '8px 16px', borderRadius: '10px', border:'1px solid #ccc', background:'white'}}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && resep && (
          <>
            {isMyRecipe && status === "Pending" && (
              <div className="status-banner yellow">
                ⚠️ <strong>Menunggu Persetujuan</strong>
                <p>Resep ini sedang direview oleh admin.</p>
              </div>
            )}
            {isMyRecipe && status === "Rejected" && (
              <div className="status-banner red">
                ⛔ <strong>Resep Ditolak</strong>
                <p>Alasan: {feedback || "Tidak memenuhi standar."}</p>
              </div>
            )}
            {isMyRecipe && status === "Approved" && (
              <div className="status-banner green">
                ✅ <strong>Resep Aktif</strong>
                <p>Resepmu sudah tayang.</p>
              </div>
            )}

            <div className="hero-image">
              <img
                src={resep.gambar || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={resep.nama_resep}
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Error"; }}
              />
            </div>

            <div className="info-card">
              <div className="info-item">
                <strong>Waktu masak:</strong> {resep.durasi} Menit
              </div>
              <div className="info-item">
                <strong>Porsi:</strong> {resep.porsi} Orang
              </div>
            </div>

            <div className="content-card">
              <h3>Bahan Utama:</h3>
              <ul>
                {parseList(resep.bahan).map((item, index) => (
                   <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="content-card">
              <h3>Langkah Memasak:</h3>
              <ul className="step-list">
                {parseList(resep.langkah).map((step, index) => (
                   <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="spacer-navbar"></div>
      </div>

      <Navbar />
    </div>
  );
};

export default DetailResep;