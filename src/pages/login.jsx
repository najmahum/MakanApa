import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import WarningIcon from "../assets/icons/warning.svg"
import Header from "../components/header";
import Integrasi from "../config/integrasi";

const Login = () => {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    const handleLogin = async() => {
        if(!identifier || !password) {
            alert("Harap isi username/email dan password!");
            return;
        }
        setIsLoading(true);
        
        try {
            const response = await Integrasi.post("/api/auth/login", {
                identifier: identifier,
                password: password
            });

            if (response.data.token) {
                localStorage.setItem("userToken", response.data.token);
                if(response.data.user) {
                    localStorage.setItem("userData", JSON.stringify(response.data.user));
                }
                navigate("/home");
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data.error || "";

                if (status === 403 || msg.toLowerCase().includes("blokir")) {
                    setShowBlockedModal(true);
                } else {
                    alert(msg || "Login gagal, periksa data Anda.");
                }
            } else {
                alert("Gagal koneksi ke server.");
            }
        } finally {
            setIsLoading(false);
        } 
    };

    const handleGuest = () => {
        sessionStorage.removeItem("draftBahan");
        navigate("/home");
    };

return (
        <div className="login-container">
            <Header title="Login" backLink="/home"/>

            <img src={logoOranye} alt="logo" className="logo" />
            
            <input 
                type="text" 
                placeholder="Username/Email" 
                className="login-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
            />
            
            <input 
                type="password" 
                placeholder="Password" 
                className="login-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            
            <p className="password">Lupa password?</p>

            <button className="login-button" onClick={handleLogin} disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
            </button>
            
            <p className="register">
                Belum punya akun? <Link to="/register">Daftar sekarang</Link>
            </p>

            {showBlockedModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <img src={WarningIcon} alt="Warning" className="warning-icon" />
                        
                        <h3>Peringatan!</h3>
                        <p className="modal-desc">
                            Akun kamu diblokir karena terdeteksi melakukan tindakan mencurigakan.
                            <br/>
                        </p>

                        <div className="modal-buttons">
                            <button className="btn-outline" onClick={() => setShowBlockedModal(false)}>
                                Oke
                            </button>
                            <button className="btn-outline-red" onClick={handleGuest}>
                                Masuk sebagai guest
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    )
}

export default Login;