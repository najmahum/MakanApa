import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import masak from "../assets/logo/masak sendiri.svg";
import makan from "../assets/logo/makan diluar.svg"
import Navbar from "../components/navbar";

const Home = () => {
    return(
    <div className="Home-container">
        <Link to="/login" className="login-btn">Login</Link>
        <img src={logoOranye} alt="logo" className="logo"></img>
        <div className="button-container">
            <div className="menu-button">
                <div className="icon-wrapper masak-bg">
                    <img src={masak} className="icon-image" alt="masak"/>
                </div>
                <Link to="/masukanbahan" className="masakSendiri">MASAK SENDIRI</Link>
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

export default Home