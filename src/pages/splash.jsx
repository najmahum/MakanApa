import React, { useEffect } from "react";
import "../styles/splash.css";
import logo from "../assets/logo/logo makanapa putih.svg";
import { useNavigate } from "react-router-dom";

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(()=>{
            navigate("/home");
        }, 3000);

        return () => clearTimeout(timer);
    },[navigate]);

    return(
    <div className="splash-container">
        <img src={logo} alt="logo" className="splash-logo"></img>
    </div>
    );
};

export default Splash;