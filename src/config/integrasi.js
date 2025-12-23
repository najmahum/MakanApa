import axios from "axios";

// Pastikan Base URL benar
const Integrasi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"
});

// --- BAGIAN INI SANGAT PENTING (INTERCEPTOR) ---
Integrasi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari penyimpanan

  if (token) {
    // Tempel token di header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Warning: Token tidak ditemukan di LocalStorage!");
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default Integrasi;