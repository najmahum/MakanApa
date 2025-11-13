import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Splash from "./pages/splash";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MasukanBahan from "./pages/masukanbahan";
import MakandiLuar from "./pages/makandiluar";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/masukanbahan" element={<MasukanBahan/>} />
        <Route path="/makandiluar" element={<MakandiLuar/>} />
      </Routes>
    </Router>
  );
}

export default App;