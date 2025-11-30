import React, { useState } from "react"; // 1. Import useState
import { Link, useNavigate } from "react-router-dom"; // (Opsional, untuk pindah halaman)
import "../styles/register.css";
import logoOranye from "../assets/logo/logo makanapa oranye.svg";

const Register = () => {
    // 2. Buat "state" untuk menampung data input
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // (Opsional, untuk pindah halaman)

    // 3. Ini fungsi yang akan berjalan saat form di-submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh

        // Ambil alamat API dari file .env frontend
        const API_URL = process.env.REACT_APP_API_URL;

        console.log("Mengirim data ke:", `${API_URL}/register`);

        try {
            const response = await fetch(`${API_URL}/register`, { // 4. Panggil API
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    // Pastikan body ini sesuai dengan yang dibutuhkan backend-mu
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Kalau server kasih error (misal: "email sudah ada")
                throw new Error(data.error || "Gagal mendaftar");
            }

            // Jika sukses
            console.log("Registrasi sukses:", data);
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login"); // (Opsional) Pindahkan user ke halaman login

        } catch (error) {
            // Kalau error (misal: server backend mati, CORS salah)
            console.error("Error saat registrasi:", error.message);
            alert(`Registrasi Gagal: ${error.message}`);
        }
    };

    return (
        // 5. Ubah <div> jadi <form> dan panggil handleSubmit
        <form className="register-container" onSubmit={handleSubmit}> 
            <p className="register-text">Register</p>
            <img src={logoOranye} alt="logo" className="logo"></img>

            {/* 6. Hubungkan input ke "state" */}
            <input
                type="text"
                placeholder="Username"
                className="register-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email" // Ganti type jadi "email" untuk validasi browser
                placeholder="Email"
                className="register-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="register-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {/* 7. Buat <button> agar bisa submit */}
            <button type="submit" className="register-button">Sign Up</button>

            <p className="login">
                Sudah punya akun? <Link to="/login">Login</Link>
            </p>
        </form>
    );
};

export default Register;