import React from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";

const Register = () => {
    return (
        <div className="register-container">
            <p className="register-text">Register</p>
            <img src={logoOranye} alt="logo" className="logo"></img>
            <input type="text" placeholder="Username" className="register-input" />
            <input type="text" placeholder="Email" className="register-input" />
            <input type="password" placeholder="Password" className="register-input" />
            <button className="register-button"><Link to="/login">Sign Up</Link></button>
            <p className="login">
                Sudah punya akun? <Link to="/login">Login</Link>
            </p>
        </div> 
    )
}

export default Register;