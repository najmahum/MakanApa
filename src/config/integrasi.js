import axios from "axios";

console.log("URL Backend:", process.env.REACT_APP_BACKEND_URL); // <-- Cek di Console Browser (F12)

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

export default api;