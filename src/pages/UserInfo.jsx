import React, { useState, useEffect, useCallback } from 'react';
import { User, ChevronDown } from 'lucide-react';
import Integrasi from '../config/integrasi';
import '../styles/UserInfo.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitPeriod, setVisitPeriod] = useState('last_week');
  const [showVisitDropdown, setShowVisitDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk data
  const [visitStats, setVisitStats] = useState({ total_visits: 0, chart_data: [] });
  const [userStats, setUserStats] = useState({ total_users: 0, new_users_today: 0 });
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filterRecipeStatus, setFilterRecipeStatus] = useState('all');
  const [showRecipeFilterDropdown, setShowRecipeFilterDropdown] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentUser, setCurrentUser] = useState({ username: '', name: '', email: '' });

  // ===================== Helper =====================
  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  // ===================== Fetch Functions =====================
  const fetchVisitorStats = useCallback(async (period) => {
    try {
      setLoading(true);
      const response = await Integrasi.get(`/api/admin/dashboard/stats`, { params: { period } });
      setVisitStats(response.data);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengambil data statistik kunjungan';
      showNotification(errorMsg, 'error');
      setVisitStats({ total_visits: 0, chart_data: [] });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await Integrasi.get('/api/admin/users/stats');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengambil data statistik user';
      showNotification(errorMsg, 'error');
      setUserStats({ total_users: 0, new_users_today: 0 });
    }
  }, [showNotification]);

  const fetchUsers = useCallback(async (status = null) => {
    try {
      setLoading(true);
      const params = status ? { status } : {};
      params._t = Date.now();
      const response = await Integrasi.get('/api/admin/users', { params });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengambil data user';
      showNotification(errorMsg, 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchRecipes = useCallback(async (status = null) => {
    try {
      setLoading(true);
      const params = status && status !== 'all' ? { status } : {};
      const response = await Integrasi.get('/api/admin/recipes', { params });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengambil data resep';
      showNotification(errorMsg, 'error');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await Integrasi.get('/api/admin/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      showNotification('Gagal mengambil data user login', 'error');
    }
  }, [showNotification]);

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      const response = await Integrasi.put(`/api/admin/users/${userId}/status`, { status: newStatus });

      setUsers(prevUsers => prevUsers.map(user => 
        user.id_user === userId ? { ...user, status: newStatus } : user
      ));

      const message = response.data.message || `User berhasil ${newStatus === 'blocked' ? 'diblokir' : 'diunblock'}`;
      showNotification(message, newStatus === 'blocked' ? 'error' : 'success');

    } catch (error) {
      console.error('Error updating user status:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengubah status user';
      showNotification(errorMsg, 'error');
    }
  };

  const handleApproveRecipe = async (recipeId, newStatus) => {
    try {
      const response = await Integrasi.put(`/api/admin/recipes/${recipeId}/status`, { 
        status: newStatus 
      });

      setRecipes(prevRecipes => prevRecipes.map(recipe => 
        recipe.id_resep === recipeId ? { ...recipe, status: newStatus } : recipe
      ));

      const statusText = newStatus === 'approved' ? 'disetujui' : 
                        newStatus === 'rejected' ? 'ditolak' : 'diubah';
      const message = response.data.message || `Resep berhasil ${statusText}`;
      showNotification(message, newStatus === 'approved' ? 'success' : 'error');

    } catch (error) {
      console.error('Error updating recipe status:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengubah status resep';
      showNotification(errorMsg, 'error');
    }
  };

  // ===================== useEffect =====================
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchVisitorStats(visitPeriod);
    } else if (activeTab === 'users') {
      fetchUserStats();
      fetchUsers(filterStatus === 'all' ? null : filterStatus);
    } else if (activeTab === 'management') {
      fetchRecipes(filterRecipeStatus);
    }
  }, [activeTab, visitPeriod, filterStatus, filterRecipeStatus, fetchVisitorStats, fetchUserStats, fetchUsers, fetchRecipes]);

  // ===================== Render Functions =====================
  const maxValue = Math.max(...visitStats.chart_data.map(d => d.visitors), 1);

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
              {visitPeriod === 'last_3_days' ? 'Last 3 Days' : 
               visitPeriod === 'last_week' ? 'Last Week' : 
               visitPeriod === 'last_month' ? 'Last Month' : 'Last Week'}
              <ChevronDown size={16} />
            </button>
            {showVisitDropdown && (
              <div className="dropdown-menu">
                {['last_3_days', 'last_week', 'last_month'].map((p) => (
                  <button 
                    key={p}
                    className={`dropdown-item ${visitPeriod === p ? 'active' : ''}`}
                    onClick={() => { 
                      setVisitPeriod(p); 
                      setShowVisitDropdown(false); 
                    }}
                  >
                    {p === 'last_3_days' ? 'Last 3 Days' : 
                     p === 'last_week' ? 'Last Week' : 'Last Month'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="stats-summary">
          <p>Total Kunjungan: <strong>{visitStats.total_visits}</strong></p>
          <p className="period-info">Period: {visitStats.period || visitPeriod}</p>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : visitStats.chart_data.length > 0 ? (
            visitStats.chart_data.map((data, index) => (
              <div key={index} className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ height: `${(data.visitors / maxValue) * 100}%` }}
                  title={`${data.visitors} visitors`}
                >
                  <span className="bar-value">{data.visitors}</span>
                </div>
                <span className="bar-label">
                  {new Date(data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>📊 Tidak ada data kunjungan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserInfo = () => (
    <div className="content-panel">
      <h2 className="panel-title">User Information</h2>
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">Total User</span>
          <div className="stat-box total-users">
            <div className="stat-number">{userStats.total_users}</div>
            <div className="stat-desc">Registered Users</div>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">User Baru Hari Ini</span>
          <div className="stat-box new-users">
            <div className="stat-number">{userStats.new_users_today}</div>
            <div className="stat-desc">New Today</div>
          </div>
        </div>
      </div>

      <div className="user-table-container">
        <div className="table-controls">
          <h3>Daftar User</h3>
          <div className="dropdown-container">
            <button 
              className="dropdown-button filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              Filter: {filterStatus === 'all' ? 'Semua' : filterStatus === 'active' ? 'Active' : 'Blocked'}
              <ChevronDown size={16} />
            </button>
            {showFilterDropdown && (
              <div className="dropdown-menu">
                {[
                  { value: 'all', label: 'Semua User' },
                  { value: 'active', label: 'Active' },
                  { value: 'blocked', label: 'Blocked' }
                ].map((option) => (
                  <button 
                    key={option.value}
                    className={`dropdown-item ${filterStatus === option.value ? 'active' : ''}`}
                    onClick={() => { 
                      setFilterStatus(option.value); 
                      setShowFilterDropdown(false); 
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <div className="table-header">
            <div className="table-col col-id">ID</div>
            <div className="table-col col-username">Username</div>
            <div className="table-col col-email">Email</div>
            <div className="table-col col-status">Status</div>
            <div className="table-col col-action">Action</div>
          </div>

          <div className="table-body">
            {loading ? (
              <div className="loading-row">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Memuat data user...</p>
                </div>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div 
                  key={user.id_user} 
                  className={`table-row ${user.status === 'blocked' ? 'blocked-row' : ''}`}
                >
                  <div className="table-col col-id">{user.id_user}</div>
                  <div className="table-col col-username" title={user.username}>{user.username}</div>
                  <div className="table-col col-email" title={user.email}>{user.email}</div>
                  <div className="table-col col-status">
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '✓ Active' : '✕ Blocked'}
                    </span>
                  </div>
                  <div className="table-col col-action">
                    <button 
                      className={`action-btn ${user.status === 'blocked' ? 'unblock' : 'block'}`}
                      onClick={() => handleBlockUser(user.id_user, user.status)}
                      disabled={loading}
                    >
                      {user.status === 'blocked' ? 'Unblock' : 'Blokir'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>👤 Tidak ada data user</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagement = () => (
    <div className="content-panel">
      <h2 className="panel-title">Management Resep</h2>
      
      <div className="recipe-table-container">
        <div className="table-controls">
          <h3>Daftar Resep</h3>
          <div className="dropdown-container">
            <button 
              className="dropdown-button filter-btn"
              onClick={() => setShowRecipeFilterDropdown(!showRecipeFilterDropdown)}
            >
              Filter: {filterRecipeStatus === 'all' ? 'All' : 
                      filterRecipeStatus === 'waiting' ? 'Pending' : 
                      filterRecipeStatus === 'approved' ? 'Approved' : 'Rejected'}
              <ChevronDown size={16} />
            </button>

            {showRecipeFilterDropdown && (
              <div className="dropdown-menu">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'waiting', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' }
                ].map((option) => (
                  <button 
                    key={option.value}
                    className={`dropdown-item ${filterRecipeStatus === option.value ? 'active' : ''}`}
                    onClick={() => { 
                      setFilterRecipeStatus(option.value); 
                      setShowRecipeFilterDropdown(false); 
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <div className="recipe-table-header">
            <div className="table-col col-number">No</div>
            <div className="table-col col-recipe-username">User Name</div>
            <div className="table-col col-recipe-title">Judul Resep</div>
            <div className="table-col col-recipe-status">Status</div>
          </div>

          <div className="table-body">
            {loading ? (
              <div className="loading-row">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Memuat data resep...</p>
                </div>
              </div>
            ) : recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <div 
                  key={recipe.id_resep} 
                  className={`table-row recipe-row ${
                    recipe.status === 'rejected' ? 'rejected-row' : 
                    recipe.status === 'approved' ? 'approved-row' : ''
                  }`}
                >
                  <div className="table-col col-number">{index + 1}</div>
                  <div className="table-col col-recipe-username" title={recipe.pembuat}>
                    {recipe.pembuat}
                  </div>
                  <div className="table-col col-recipe-title" title={recipe.nama_resep}>
                    {recipe.nama_resep}
                  </div>
                  <div className="table-col col-recipe-status">
                    {recipe.status === 'waiting' ? (
                      <div className="recipe-actions">
                        <button 
                          className="recipe-action-btn approve-btn"
                          onClick={() => handleApproveRecipe(recipe.id_resep, 'approved')}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button 
                          className="recipe-action-btn reject-btn"
                          onClick={() => handleApproveRecipe(recipe.id_resep, 'rejected')}
                          disabled={loading}
                        >
                          Rejected
                        </button>
                      </div>
                    ) : (
                      <span className={`recipe-status-badge ${recipe.status}`}>
                        {recipe.status === 'approved' ? 'Approved' : 
                         recipe.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>📝 Tidak ada data resep</p>
              </div>
            )}
          </div>
        </div>
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
            <span className="info-value">{currentUser.username || 'SuperAdmin'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Nama</span>
            <span className="info-value">{currentUser.name || 'Admin'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{currentUser.email || 'admin@makanyuk.com'}</span>
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

  // ===================== RETURN =====================
  return (
    <div className="dashboard-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* PERBAIKAN DI SINI: Ganti 'top-nav' jadi 'admin-top-nav' */}
      <nav className="admin-top-nav">
        
        {/* Ganti 'nav-item' jadi 'admin-nav-item' di semua tombol */}
        <button 
          className={activeTab === 'dashboard' ? 'admin-nav-item active' : 'admin-nav-item'} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        
        <button 
          className={activeTab === 'users' ? 'admin-nav-item active' : 'admin-nav-item'} 
          onClick={() => setActiveTab('users')}
        >
          User Information
        </button>
        
        <button 
          className={activeTab === 'management' ? 'admin-nav-item active' : 'admin-nav-item'} 
          onClick={() => setActiveTab('management')}
        >
          Management Resep
        </button>
        
        <button 
          className={activeTab === 'profile' ? 'admin-nav-item active' : 'admin-nav-item'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUserInfo()}
        {activeTab === 'management' && renderManagement()}
        {activeTab === 'profile' && renderProfile()}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;