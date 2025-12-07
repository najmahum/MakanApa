import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PermissionPage.css";
import locationIcon from "../assets/icons/location.svg";

export default function PermissionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handler untuk "Saat menggunakan aplikasi"
  const handleAllow = () => {
    setLoading(true);
    
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location granted:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Simpan ke state/localStorage jika perlu
          localStorage.setItem('locationPermission', 'granted');
          localStorage.setItem('latitude', position.coords.latitude);
          localStorage.setItem('longitude', position.coords.longitude);
        
          // Navigate ke menu
          navigate("/menu");
        },
        (error) => {
          console.error('Location denied:', error);
          alert('Izin lokasi ditolak. Anda tetap bisa melanjutkan tanpa lokasi.');
          navigate("/menu");
        }
      );
    } else {
      alert('Geolocation tidak didukung di browser ini.');
      navigate("/menu");
    }
  };

  <img
  src={locationIcon}
  alt="location"
  className="permission-icon"
  style={{ width: 48, height: 48, display: "block" }}
  />

  // Handler untuk "Hanya untuk kali ini"
  const handleOnce = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location granted (once):', position);
          localStorage.setItem('locationPermission', 'once');
          navigate("/menu");
        },
        (error) => {
          console.error('Location denied:', error);
          navigate("/menu");
        }
      );
    } else {
      navigate("/menu");
    }
  };

  // Handler untuk "Tolak"
  const handleDeny = () => {
    localStorage.setItem('locationPermission', 'denied');
    navigate("/menu");
  };

  return (
    <div className="permission-page">
      <div className="permission-content-wrapper">
        <div className="permission-card">
          <div className="permission-icon-wrapper">
            <img src={locationIcon} alt="location" className="permission-icon" />
          </div>
          
          <h2 className="permission-title">
            Izinkan MakanApa? untuk mengakses lokasi perangkat ini?
          </h2>

          <button 
            className="permission-btn allow" 
            onClick={handleAllow}
            disabled={loading}
          >
            {loading ? 'Meminta izin...' : 'Saat menggunakan aplikasi'}
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