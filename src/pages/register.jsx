import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css"; // CSS tetap register.css
import logoOranye from "../assets/logo/logo makanapa oranye.svg";
import Header from "../components/header"; // Tambah header biar ada tombol back
import Integrasi from "../config/integrasi";

const Register = () => {
    const navigate = useNavigate();

    // 1. State Data
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 2. Fungsi Submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah reload

        // Validasi
        if(!username || !email || !password) {
            alert("Semua data wajib diisi!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await Integrasi.post("/api/auth/register", {
                username: username,
                email: email,
                password: password
            });

            // 4. Jika Sukses
            // Biasanya backend kirim status 200/201 atau object user
            if (response.status === 200 || response.data) {
                console.log("Registrasi sukses:", response.data);
                alert("Registrasi berhasil! Silakan login.");
                navigate("/login");
            }

        } catch (error) {
            // 5. Handle Error
            console.error("Error register:", error);
            
            if (error.response) {
                // Ambil pesan error dari backend
                const msg = error.response.data.error || "Gagal mendaftar.";
                alert(msg);
            } else {
                alert("Gagal koneksi ke server.");
            }
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Header title="Register" backLink="/Home" />

            <img src={logoOranye} alt="logo" className="logo" style={{marginTop: '20px'}} />

            {/* Form */}
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <input
                    type="text"
                    placeholder="Username"
                    className="register-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="register-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="register-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Tombol pakai onClick handler */}
                <button 
                    className="register-button" 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Sign Up"}
                </button>
            </div>

            <p className="login">
                Sudah punya akun? <Link to="/login" style={{fontWeight: 'bold'}}>Login</Link>
            </p>
        </div>
    );
};

export default Register;