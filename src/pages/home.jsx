import React from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import masak from "../assets/logo/masak sendiri.svg";
import makan from "../assets/logo/makan diluar.svg"
import Navbar from "../components/navbar";

const Home = () => {
    const navigate = useNavigate()
    return(
    <div className="Home-container">
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        <img src={logoOranye} alt="logo" className="logo"></img>
        <div className="button-container">
            <div className="menu-button">
                <div className="icon-wrapper masak-bg">
                    <img src={masak} className="icon-image" alt="masak" />
                </div>
                <button className="masakSendiri">MASAK SENDIRI</button>
            </div>

            <div className="menu-button">
                <div className="icon-wrapper makan-bg">
                    <img src={makan} className="icon-image" alt="makan" />
                </div>
                <button className="makandiLuar">MAKAN DI LUAR</button>
            </div>
        </div>
        <Navbar/>
    </div>
    );
}

export default Home