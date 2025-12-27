import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Integrasi from "../config/integrasi";
import "../styles/detailresep.css";

const DetailResep = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { isMyRecipe, status, feedback } = location.state || {};

  const [resep, setResep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // STATE BARU: Untuk handle gambar error
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true);
        const response = await Integrasi.get(`/api/resep/${id}`);
        // Handle struktur response backend
        setResep(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
        setError("Gagal memuat resep.");
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [id]);

  // FUNGSI PARSE LIST (LEBIH PINTAR)
  // Bisa baca format ["a", "b"] maupun "a--b"
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data; 
    
    // Cek apakah stringnya format JSON Array?
    if (typeof data === 'string' && data.trim().startsWith('[')) {
        try {
            // Bersihkan tanda kutip satu (') jadi dua (") biar valid JSON
            const validJson = data.replace(/'/g, '"');
            return JSON.parse(validJson);
        } catch (e) {
            console.log("Bukan JSON, lanjut split biasa");
        }
    }

    // Kalau bukan JSON, pake split '--' (kode lamamu)
    if (typeof data === 'string') {
      return data.split('--').filter(item => item.trim() !== "");
    }
    return [data];
  };

  const handleEdit = () => {
    navigate(`/tambah-resep`, {
      state: { 
        isEdit: true, 
        resepData: resep 
      } 
    });
  };

  const backLink = isMyRecipe ? "/resepku" : "/hasil-resep"; // Sesuaikan path ini
  const pageTitle = resep?.nama_resep || "Detail Resep";

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Header title={pageTitle} backLink={backLink} />
      </div>

      <div className="content-scroll">
        {loading && (
          <div className="state-center"><p>Sedang memuat resep...</p></div>
        )}

        {!loading && error && (
          <div className="state-center">
            <p style={{color: '#FF5858'}}>{error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && resep && (
          <>
            {/* --- STATUS BANNERS --- */}
            {isMyRecipe && status === "pending" && (
              <div className="status-banner yellow">
                ⚠️ <strong>Menunggu Persetujuan</strong>
                <p>Resep ini sedang direview oleh admin.</p>
              </div>
            )}
            {isMyRecipe && status === "rejected" && (
              <div className="status-banner red">
                ⛔ <strong>Resep Ditolak</strong>
                <p>Alasan: {feedback || "Tidak memenuhi standar."}</p>
              </div>
            )}
            {isMyRecipe && status === "approved" && (
              <div className="status-banner green">
                ✅ <strong>Resep Aktif</strong>
                <p>Resepmu sudah tayang.</p>
              </div>
            )}

            {/* --- LOGIC GAMBAR BARU --- */}
            <div className="hero-image">
              {imageError || !resep.gambar ? (
                // TAMPILAN KOTAK WARNA (JIKA NULL/ERROR)
                <div className="image-fallback-big">
                    <span>{resep.nama_resep}</span>
                </div>
              ) : (
                // TAMPILAN GAMBAR ASLI
                <img
                  src={resep.gambar}
                  alt={resep.nama_resep}
                  onError={() => setImageError(true)}
                  className="img-full"
                />
              )}
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
              <h3>Bahan:</h3>
              <ul className="custom-list">
                {parseList(resep.bahan).map((item, index) => (
                   <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="content-card">
              <h3>Langkah Memasak:</h3>
              <ul className="custom-list-ordered">
                {parseList(resep.langkah).map((step, index) => (
                   <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            {/* TOMBOL EDIT */}
            {isMyRecipe && (
                <div style={{marginTop: '30px', marginBottom: '20px'}}>
                    <button className="btn-edit-big" onClick={handleEdit}>
                        EDIT RESEP INI
                    </button>
                </div>
            )}
          </>
        )}

        <div className="spacer-navbar"></div>
      </div>

      <Navbar />
    </div>
  );
};

export default DetailResep;