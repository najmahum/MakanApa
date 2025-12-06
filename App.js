import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PermissionPage from './pages/PermissionPage';
import MenuInputGuest from './pages/MenuInputGuest';
import RestaurantApp from './pages/RestaurantApp';
import DetailView from './pages/DetailView';
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin";
import UserInformationSuperAdmin from "./pages/UserInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PermissionPage />} />
        <Route path="/menu" element={<MenuInputGuest />} />
        <Route path="/restaurant" element={<RestaurantApp/>} />
        <Route path="/detail" element={<DetailView />} />
        <Route path="/dashboard" element={<DashboardSuperAdmin />} />
        <Route path="/user-info" element={<UserInformationSuperAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
