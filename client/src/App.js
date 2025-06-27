import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from 'axios';

// المكونات
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserPage from './pages/UserPage';

// إعداد axios
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // التحقق من حالة المستخدم عند التحميل
 useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch {
        localStorage.removeItem('token'); // ← هنا مكانها
        delete axios.defaults.headers.common['Authorization']; // ← وهنا
        setUser(null);
      }
    }

    setLoading(false);
  };

  checkAuth();
}, []);

  // تسجيل الدخول
 const handleLogin = async (email, password) => {
  try {
    const res = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    const userRes = await axios.get('/auth/me');
    setUser(userRes.data);

    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'فشل تسجيل الدخول' };
  }
};


  // إنشاء حساب
 const handleRegister = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios.post('/auth/register', { name, email, password, confirmPassword });

    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    const userRes = await axios.get('/auth/me');
    setUser(userRes.data);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'فشل إنشاء الحساب'
    };
  }
};


  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <Router>
      <Navbar user={user} logout={handleLogout} />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <LoginPage login={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <RegisterPage register={handleRegister} />} 
          />
          <Route 
  path="/user" 
  element={user ? <UserPage user={user} /> : <Navigate to="/login" />} 
/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;