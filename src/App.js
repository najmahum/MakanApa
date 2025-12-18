import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Splash from "./pages/splash";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MasukanBahan from "./pages/masukanbahan";
import HasilResep from "./pages/hasilresep";
import DetailResep from "./pages/detailresep";
import Favorite from "./pages/favorite";
import Profile from "./pages/profile";
import Resepku from "./pages/resepku";
import PermissionPage from './pages/PermissionPage';
import MenuInputGuest from './pages/MenuInputGuest';
import RestaurantApp from './pages/RestaurantApp';
import DetailView from './pages/DetailView';
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin";
import UserInformationSuperAdmin from "./pages/UserInfo";
import TambahResep from "./pages/tambahresep";
import TambahResepDetail from "./pages/tambahresepdetail";

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
        <Route path="/favorite" element={<Favorite/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/resepku" element={<Resepku/>}/>
        <Route path="/makandiluar" element={<PermissionPage />} />
        <Route path="/menu" element={<MenuInputGuest />} />
        <Route path="/restaurant" element={<RestaurantApp/>} />
        <Route path="/detail" element={<DetailView />} />
        <Route path="/dashboard" element={<DashboardSuperAdmin />} />
        <Route path="/user-info" element={<UserInformationSuperAdmin />} />
        <Route path="/tambah-resep" element={<TambahResep />} />
        <Route path="/tambah-resep-detail" element={<TambahResepDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;