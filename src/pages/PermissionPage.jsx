import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PermissionPage.css";
import locationIcon from "../assets/icons/location.svg";
import Integrasi from "../config/integrasi"; // axios instance

export default function PermissionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ===============================
  // IZINKAN SAAT MENGGUNAKAN APLIKASI
  // ===============================
  const handleAllow = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung di browser ini");
      setLoading(false);
      navigate("/menu");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // 🔥 Request ke backend
          const response = await Integrasi.get("/api/tempatmakan/cari", {
            params: {
              lat,
              lng,
            },
          });

          console.log("Response backend:", response.data);

          // Simpan data penting
          localStorage.setItem("locationPermission", "granted");
          localStorage.setItem("latitude", lat);
          localStorage.setItem("longitude", lng);
          localStorage.setItem(
            "tempatMakan",
            JSON.stringify(response.data.data)
          );

          navigate("/menu");
        } catch (error) {
          console.error("Gagal mengambil data tempat makan:", error);
          navigate("/menu");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Izin lokasi ditolak:", error);
        setLoading(false);
        navigate("/menu");
      }
    );
  };

  // ===============================
  // IZINKAN HANYA SEKALI
  // ===============================
  const handleOnce = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          await Integrasi.get("/api/tempatmakan/cari", {
            params: { lat, lng },
          });

          localStorage.setItem("locationPermission", "once");
          localStorage.setItem("latitude", lat);
          localStorage.setItem("longitude", lng);
        } catch (error) {
          console.error("Gagal request lokasi (once):", error);
        } finally {
          setLoading(false);
          navigate("/menu");
        }
      },
      () => {
        setLoading(false);
        navigate("/menu");
      }
    );
  };

  // ===============================
  // TOLAK IZIN LOKASI
  // ===============================
  const handleDeny = () => {
    localStorage.setItem("locationPermission", "denied");
    navigate("/menu");
  };

  return (
    <div className="permission-page">
      <div className="permission-content-wrapper">
        <div className="permission-card">
          <div className="permission-icon-wrapper">
            <img
              src={locationIcon}
              alt="location"
              className="permission-icon"
            />
          </div>

          <h2 className="permission-title">
            Izinkan <strong>MakanApa?</strong> mengakses lokasi perangkat ini?
          </h2>

          <button
            className="permission-btn allow"
            onClick={handleAllow}
            disabled={loading}
          >
            {loading ? "Meminta izin..." : "Saat menggunakan aplikasi"}
          </button>

          <button
            className="permission-btn once"
            onClick={handleOnce}
            disabled={loading}
          >
            Hanya untuk kali ini
          </button>

          <button
            className="permission-btn deny"
            onClick={handleDeny}
            disabled={loading}
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}
