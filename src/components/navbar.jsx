import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

import homeIcon from "../assets/icons/home.svg";
import favoriteIcon from "../assets/icons/favorite.svg";
import resepkuIcon from "../assets/icons/resepku.svg";
import profileIcon from "../assets/icons/profile.svg";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/home", label: "Home", icon: homeIcon },
    { path: "/favorite", label: "Favorite", icon: favoriteIcon },
    { path: "/resepku", label: "Resepku", icon: resepkuIcon },
    { path: "/profile", label: "Profile", icon: profileIcon },
  ];

  return (
    <div className="navbar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <img src={item.icon} alt={item.label} />
            {isActive && <span>{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;