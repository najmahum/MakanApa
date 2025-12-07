import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css"; // CSS asli kamu
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import WarningIcon from "../assets/icons/warning.svg";
import Header from "../components/header";
import Integrasi from "../config/integrasi"; // Pastikan path ini benar

const Login = () => {
    const navigate = useNavigate();

    // State
    const [identifier, setIdentifier] = useState(""); // Bisa Username / Email
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    const handleLogin = async () => {
        // 1. Validasi Input Kosong
        if (!identifier || !password) {
            alert("Harap isi username/email dan password!");
            return;
        }

        setIsLoading(true);

        try {
            // 2. Kirim ke Backend (Path: /api/auth/login)
            // Kita kirim 'identifier' karena backend kamu pakai logic .or(email, username)
            const response = await Integrasi.post("/api/auth/login", {
                identifier: identifier, 
                password: password
            });

            // 3. Jika Sukses (Ada Token)
            if (response.data.token) {
                // Simpan Token
                localStorage.setItem("userToken", response.data.token);
                
                // Simpan Data User (Penting buat Profile nanti)
                if (response.data.user) {
                    localStorage.setItem("userData", JSON.stringify(response.data.user));
                }

                // Pindah ke Home
                alert("Login berhasil!");
                navigate("/home");
            }

        } catch (error) {
            console.error("Login Error:", error);

            // 4. Handle Error Spesifik
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data.error || "Login gagal.";

                // Skenario: AKUN DIBLOKIR (Backend kirim 403 atau pesan 'blokir')
                if (status === 403 || msg.toLowerCase().includes("blokir")) {
                    setShowBlockedModal(true);
                } else {
                    alert(msg); // Munculin pesan error dari backend (misal: "Password salah")
                }
            } else {
                alert("Gagal koneksi ke server. Pastikan backend nyala.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Logic Masuk Guest (Hapus jejak login sebelumnya)
    const handleGuest = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
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

            {/* Tombol Login */}
            <button className="login-button" onClick={handleLogin} disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
            </button>
            
            <p className="register">
                Belum punya akun? <Link to="/register">Daftar sekarang</Link>
            </p>

            {/* === POPUP MODAL (Overlay) === */}
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