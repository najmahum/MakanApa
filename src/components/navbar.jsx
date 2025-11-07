import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

import homeIcon from "../assets/icons/home.svg";
import favoriteIcon from "../assets/icons/favorite.svg";
import resepkuIcon from "../assets/icons/resepku.svg";
import userIcon from "../assets/icons/user.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/home">
        <img src={homeIcon} alt="home"/>
      </Link>
      <Link to="/favorite">
        <img src={favoriteIcon} alt="favorite"/>
      </Link>
      <Link to="/resepku">
        <img src={resepkuIcon} alt="resepku"/>
      </Link>
      <Link to="/profile">
        <img src={userIcon} alt="profile"/>
      </Link>
    </div>
  );
};

export default Navbar;