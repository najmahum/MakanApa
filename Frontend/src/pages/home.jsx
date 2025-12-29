import React, { useState, useEffect } from "react"; 
import "../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import masak from "../assets/logo/masak sendiri.svg";
import makan from "../assets/logo/makan diluar.svg";
import Navbar from "../components/navbar";

const Home = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("userData");

        if (storedData) {
            try {
                const parsedUser = JSON.parse(storedData);
                if (parsedUser.role && parsedUser.role.toLowerCase() === "admin") {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Gagal membaca data user:", error);
            }
        }
    }, []);

    const handleMulaiMasak = () => {
        sessionStorage.removeItem("draftBahan");
        navigate("/masukanbahan");
    };

    return(
    <div className="Home-container">
        {isAdmin && (
            <button 
                className="admin-btn" 
                onClick={() => navigate("/user-info")}
            >
                Dashboard Admin
            </button>
        )}

        {/* Tombol Login */}
        <Link to="/login" className="login-btn">Login</Link>
        
        <img src={logoOranye} alt="logo" className="logo"></img>
        
        <div className="button-container">
            <div className="menu-button" onClick={handleMulaiMasak}>
                <div className="icon-wrapper masak-bg">
                    <img src={masak} className="icon-image" alt="masak"/>
                </div>
                <div className="masakSendiri">MASAK SENDIRI</div>
            </div>

            <div className="menu-button">
                <div className="icon-wrapper makan-bg">
                    <img src={makan} className="icon-image" alt="makan" />
                </div>
                <Link to="/makandiluar" className="makandiLuar">MAKAN DI LUAR</Link>
            </div>
        </div>
        <Navbar/>
    </div>
    );
}

export default Home;