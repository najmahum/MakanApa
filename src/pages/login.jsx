import React from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";

const Login = () => {
    return (
        <div className="login-container">
            <p className="login-text">Login</p>
            <img src={logoOranye} alt="logo" className="logo"></img>
            <input type="text" placeholder="Username/Email" className="login-input" />
            <input type="password" placeholder="Password" className="login-input" />
            <p className="password">
                Lupa password?
            </p>
            <Link to="/home" className="login-button">Login</Link>
            <p className="register">
                Belum punya akun? <Link to="/register">Daftar sekarang</Link>
            </p>
        </div> 
    )
}

export default Login;