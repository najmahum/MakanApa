import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Splash from "./pages/splash";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MasukanBahan from "./pages/masukanbahan";
import MakandiLuar from "./pages/makandiluar";
import HasilResep from "./pages/hasilresep";
import DetailResep from "./pages/detailresep";
import Favorite from "./pages/favorite";
import Profile from "./pages/profile";
import Resepku from "./pages/resepku";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/masukanbahan" element={<MasukanBahan/>} />
        <Route path="/hasilresep" element={<HasilResep/>} />
        <Route path="/detailresep" element={<DetailResep/>} />
        <Route path="/makandiluar" element={<MakandiLuar/>} />
        <Route path="/favorite" element={<Favorite/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/resepku" element={<Resepku/>}/>
      </Routes>
    </Router>
  );
}

export default App;