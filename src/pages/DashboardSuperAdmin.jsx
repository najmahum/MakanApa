// src/pages/DashboardSuperAdmin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar.jsx";
import "../styles/DashboardSuperAdmin.css";

export default function DashboardSuperAdmin() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <div className="admin-container">

      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>

        {/* Back Button */}
        <button className="btn-back" onClick={handleBack}>
          <span className="back-circle">
            <ArrowLeft size={22} />
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">

        {/* Stats Card */}
        <div className="stats-card">
          <div className="stats-header">
            <span className="stats-title">Statistik Kunjungan</span>
            <button className="lihat-semua-button">Week →</button>
          </div>

          {/* Chart */}
          <div className="chart-container">
            <div className="chart-area">

              {/* Bars */}
              <div className="chart-bars">
                <div className="bar" style={{ height: "40%" }} />
                <div className="bar" style={{ height: "60%" }} />
                <div className="bar" style={{ height: "35%" }} />
                <div className="bar" style={{ height: "80%" }} />
                <div className="bar" style={{ height: "50%" }} />
                <div className="bar" style={{ height: "70%" }} />
                <div className="bar" style={{ height: "45%" }} />
              </div>

              {/* Bar Labels */}
              <div className="chart-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar active="home" />
    </div>
  );
}