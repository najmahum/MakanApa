import React, { useState } from 'react';
import '../styles/UserInfo.css';
import { Home, User, Folder, LogOut, ChevronDown} from 'lucide-react';
import Navbar from "../components/navbar.jsx";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitPeriod, setVisitPeriod] = useState('week');
  const [userStatsPeriod, setUserStatsPeriod] = useState('week');
  const [showVisitDropdown, setShowVisitDropdown] = useState(false);
  const [showUserStatsDropdown, setShowUserStatsDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'HarryPotter', email: 'HarryPotter11@gmail.com', blocked: false },
    { id: 2, name: 'MakanYuk', email: 'MakanYuk@gmail.com', blocked: false },
    { id: 3, name: 'TukangMasak', email: 'sukamasak@gmail.com', blocked: false },
    { id: 4, name: 'RadityaDika', email: 'radit003@gmail.com', blocked: false },
    { id: 5, name: 'SparklingWater', email: 'AirSpark@gmail.com', blocked: false },
    { id: 6, name: 'FoodieAbis', email: 'MakanEnak@gmail.com', blocked: false },
    { id: 7, name: 'HarryPotter2', email: 'HarryPotter12@gmail.com', blocked: false },
    { id: 8, name: 'MakanYuk2', email: 'MakanYuk@gmail.com', blocked: false },
    { id: 9, name: 'TukangMasak2', email: 'sukamasak9@gmail.com', blocked: false },
    { id: 10, name: 'RadityaDika2', email: 'radit004@gmail.com', blocked: false },
    { id: 11, name: 'SparklingWater2', email: 'AirSpark7@gmail.com', blocked: false },
    { id: 12, name: 'FoodieAbis2', email: 'MakanEnak9@gmail.com', blocked: false },
    { id: 13, name: 'LuffyDMonkey', email: 'luffy040302@gmail.com', blocked: false },
    { id: 14, name: 'PatrickStar', email: 'bintang567@gmail.com', blocked: false },
    { id: 15, name: 'pandabambu', email: 'bambu_01@gmail.com', blocked: false },
    { id: 16, name: 'buatkuliner', email: 'makanmakan1@gmail.com', blocked: false }
  ]);

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const visitDataSets = {
    day: [
      { label: '00:00', value: 20 },
      { label: '04:00', value: 15 },
      { label: '08:00', value: 45 },
      { label: '12:00', value: 65 },
      { label: '16:00', value: 55 },
      { label: '20:00', value: 40 },
      { label: '23:59', value: 25 }
    ],
    week: [
      { label: '15/9', value: 45 },
      { label: '16/9', value: 65 },
      { label: '17/9', value: 35 },
      { label: '18/9', value: 55 },
      { label: '19/9', value: 75 },
      { label: '20/9', value: 55 },
      { label: '21/9', value: 45 }
    ],
    month: [
      { label: 'Week 1', value: 60 },
      { label: 'Week 2', value: 70 },
      { label: 'Week 3', value: 55 },
      { label: 'Week 4', value: 80 }
    ],
    year: [
      { label: 'Jan', value: 55 },
      { label: 'Feb', value: 45 },
      { label: 'Mar', value: 65 },
      { label: 'Apr', value: 60 },
      { label: 'May', value: 70 },
      { label: 'Jun', value: 75 },
      { label: 'Jul', value: 65 },
      { label: 'Aug', value: 80 },
      { label: 'Sep', value: 70 },
      { label: 'Oct', value: 75 },
      { label: 'Nov', value: 65 },
      { label: 'Dec', value: 85 }
    ]
  };

  const userStatsDataSets = {
    day: { total: 12, trend: 'up' },
    week: { total: 253, trend: 'up' },
    month: { total: 987, trend: 'up' },
    year: { total: 8456, trend: 'up' }
  };

  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, blocked: !user.blocked } : user
    ));
    
    const user = users.find(u => u.id === userId);
    const action = user.blocked ? 'Unblocked' : 'Blocked';
    
    setNotification({
      show: true,
      message: `User "${user.name}" has been ${action.toLowerCase()} successfully`,
      type: action === 'Blocked' ? 'error' : 'success'
    });

    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return !user.blocked;
    if (filterStatus === 'blocked') return user.blocked;
    return true;
  });

  const renderDashboard = () => (
    <div className="content-panel">
      <h2 className="panel-title">Dashboard</h2>
      <div className="stats-card">
        <div className="stats-header">
          <h3>Statistik Kunjungan</h3>
          <div className="dropdown-container">
            <button 
              className="dropdown-button"
              onClick={() => setShowVisitDropdown(!showVisitDropdown)}
            >
              Last {visitPeriod}
              <ChevronDown size={16} />
            </button>
            {showVisitDropdown && (
              <div className="dropdown-menu">
                {['day','week','month','year'].map((p)=>(
                  <button 
                    key={p}
                    className={`dropdown-item ${visitPeriod === p ? 'active' : ''}`}
                    onClick={() => { setVisitPeriod(p); setShowVisitDropdown(false); }}
                  >
                    {p[0].toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          {visitDataSets[visitPeriod].map((data, index) => (
            <div key={index} className="bar-wrapper">
              <div className="bar" style={{ height: `${data.value}%` }}></div>
              <span className="bar-label">{data.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  const renderUserInfo = () => (
    <div className="content-panel">
      <h2 className="panel-title">User Information</h2>
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">Jumlah User</span>
          <div className="stat-box total-users">
            {userStatsDataSets[userStatsPeriod].total}
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-label">Statistik Pendaftar User</span>
          <div className="stat-box chart-preview">
            <div className="chart-preview-header">
              <div className="dropdown-container">
                <button 
                  className="dropdown-button small"
                  onClick={() => setShowUserStatsDropdown(!showUserStatsDropdown)}
                >
                  Last {userStatsPeriod}
                  <ChevronDown size={14} />
                </button>
                {showUserStatsDropdown && (
                  <div className="dropdown-menu">
                    {['day','week','month','year'].map((p)=>(
                      <button 
                        key={p}
                        className={`dropdown-item ${userStatsPeriod === p ? 'active' : ''}`}
                        onClick={() => { setUserStatsPeriod(p); setShowUserStatsDropdown(false); }}
                      >
                        {p[0].toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mini-chart">
              <svg viewBox="0 0 100 40" className="chart-line">
                <polyline
                  points="0,30 20,25 40,20 60,15 80,10 100,5"
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="2"
                />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="user-table-container">
        <div className="table-header">
          <div className="table-col">ID</div>
          <div className="table-col">User Name</div>
          <div className="table-col">Email</div>
          <div className="table-col">
            <div className="dropdown-container">
              <button 
                className="dropdown-button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                {filterStatus === 'all' ? 'All' : filterStatus === 'active' ? 'Active' : 'Blocked'}
                <ChevronDown size={16} />
              </button>

              {showFilterDropdown && (
                <div className="dropdown-menu">
                  {['all','active','blocked'].map((s)=>(
                    <button 
                      key={s}
                      className={`dropdown-item ${filterStatus === s ? 'active' : ''}`}
                      onClick={() => { setFilterStatus(s); setShowFilterDropdown(false); }}
                    >
                      {s[0].toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-body">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`table-row ${user.blocked ? 'blocked' : ''}`}>
              <div className="table-col">{user.id}</div>
              <div className="table-col">{user.name}</div>
              <div className="table-col">{user.email}</div>
              <div className="table-col">
                <button 
                  className={`action-btn ${user.blocked ? 'unblock' : 'block'}`}
                  onClick={() => handleBlockUser(user.id)}
                >
                  {user.blocked ? 'Unblock' : 'Blokir'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  const renderManagement = () => (
    <div className="content-panel">
      <h2 className="panel-title">Management Resep</h2>
      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <p>Ups! Fitur ini sedang dalam pengembangan</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="content-panel">
      <h2 className="panel-title">Profile</h2>
      <div className="profile-container">
        <div className="profile-avatar">
          <User size={80} strokeWidth={1.5} />
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value">SuperAdmin</span>
          </div>
          <div className="info-row">
            <span className="info-label">Nama</span>
            <span className="info-value">Admin</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">MakanYukAdmin@gmail.com</span>
          </div>
          <div className="info-row">
            <span className="info-label">Password</span>
            <span className="info-value">••••••••••</span>
          </div>
        </div>

        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <nav className="top-nav">
        <button
          className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard SuperAdmin
        </button>
        <button
          className={activeTab === 'users' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('users')}
        >
          User information SuperAdmin
        </button>
        <button
          className={activeTab === 'management' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('management')}
        >
          Management resep superadmin
        </button>
        <button
          className={activeTab === 'profile' ? 'nav-item active' : 'nav-item'}
          onClick={() => setActiveTab('profile')}
        >
          Profile Super Admin
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUserInfo()}
        {activeTab === 'management' && renderManagement()}
        {activeTab === 'profile' && renderProfile()}
      </main>

           {/* Navbar */}
      <Navbar active="home" />
    </div>
  );
};

export default SuperAdminDashboard;
