import React, {useState} from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import "../styles/masukanbahan.css";
import backIcon from "../assets/icons/back.svg";

const MasakSendiri = () => {
  const [satuan, setSatuan] = useState("");
  const satuanOptions = ["gram", "kg", "ml", "liter", "ikat", "buah", "butir"];

  return (
    <div className="bahan-container">
      <div className="header-bahan">
        <Link to="/home"><img src={backIcon} className="icon-back" alt="back"/></Link>
        <h2>Masukkan Bahan yang Kamu Miliki</h2>
      </div>
      <div className="input-box">
        <label>Nama Bahan</label>
        <input type="text" placeholder="Masukkan di sini" />
        <div className="jumlah">
          <button>-</button>
          <input type="number" min="0" />
          <button>+</button>
        </div>
        <select className="dropdown-satuan" value={satuan} onChange={(e) => setSatuan(e.target.value)}>
          <option value="">Pilih</option>
          {satuanOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
      </div>      
      <Navbar/>
    </div>
  );
};

export default MasakSendiri;