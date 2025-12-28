import React from "react";
import { Link } from "react-router-dom";
import backIcon from "../assets/icons/back.svg";
import "../styles/header.css";

const Header = ({ title, backLink }) => {
  return (
    <div className="header-container">
      {backLink && (
        <Link to={backLink} className="back-button">
          <img src={backIcon} alt="back" />
        </Link>
      )}
      <h2>{title}</h2>
    </div>
  );
};

export default Header;