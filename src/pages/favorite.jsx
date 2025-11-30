import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import "../styles/favorite.css";

// Import Assets
import SadFaceIcon from "../assets/icons/profile.svg"; // Icon belum login
import ClockIcon from "../assets/icons/clock.svg";
import HeartRedIcon from "../assets/icons/redheart.svg";

const Favorit = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  // DUMMY DATA FAVORIT (Ceritanya dari backend)
  const dummyFav = [
    { id: 1, title: "Sup Telur", time: 10, image: "https://via.placeholder.com/300x150" },
    { id: 2, title: "Tumis Buncis", time: 15, image: "https://via.placeholder.com/300x150" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLogin(!!token); // Kalau ada token jadi true, gak ada jadi false
  }, []);

  const handleResepClick = (id) => {
    navigate(`/resep/${id}`);
  };

  return (
    <div className="favorit-container">
      <div className="fixed-header">
         <Header title="Resep Favorit" backLink="/home" />
      </div>

      <div className="favorit-content">
        {isLogin ? (
          // --- TAMPILAN SUDAH LOGIN (List Resep) ---
          <div className="fav-list-area">
            {dummyFav.map((resep) => (
              <div className="fav-card" key={resep.id} onClick={() => handleResepClick(resep.id)}>
                <img src={resep.image} alt={resep.title} className="fav-img" />
                <div className="fav-info">
                  <h3>{resep.title}</h3>
                  <div className="fav-meta">
                    <div className="time">
                        <img src={ClockIcon} alt="time" /> {resep.time} Menit
                    </div>
                    <img src={HeartRedIcon} alt="love" className="love-icon" />
                  </div>
                </div>
              </div>
            ))}
            <div className="spacer-bottom"></div>
          </div>
        ) : (
          // --- TAMPILAN BELUM LOGIN (Guest) ---
          <div className="fav-guest">
            <img src={SadFaceIcon} alt="Sad" className="guest-icon-fav" />
            <p className="guest-text-bold">Wah kamu belum login..</p>
            <Link to="/login" className="link-text">
                <p className="guest-text">Login untuk menyimpan resep favoritmu!</p>
            </Link>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Favorit;