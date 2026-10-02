import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import QRCode from 'react-qr-code';
import '../css/Profile.css';
import BottomNav from '../components/ButtonNav';
import {useAuth} from '../context/authContext';
import { useNavigate } from 'react-router-dom';

// Variasi Animasi Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Profile = () => {
  const {user,isLoading,error,logout} = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Fungsi untuk copy UID
  const handleCopyUID = () => {
    navigator.clipboard.writeText(user?.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset selepas 2 saat
  };

  const handleLogout = () => {
  const token = localStorage.getItem('token');
  if (token) {
    logout()
      navigate('/');
  }
  
}

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-top">
          {/* Butang Back: Tanpa Bulatan, Hanya Icon */}
          <button className="profile-back-btn">
            <Icon icon="mdi:chevron-left" />
          </button>
          
          <button className="edit-btn">
            <Icon icon="mdi:pencil-outline" />
          </button>
        </div>
        
        <div className="header-text">
          
          <h1 className="profile-header-title">Profile</h1>
        </div>
      </div>

      {/* Profile Info */}
      <motion.div 
        className="profile-info"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="avatar-large">
          <Icon icon="mdi:account" />
        </div>
        <h2 className="user-name">{user?.data?.name || 'name'}</h2>
        <p className="user-email">{user?.data?.email || 'email'}</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="stats-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >


        <motion.div className="stat-card" variants={itemVariants}>
          <span className="stat-label">UID</span>
          <span className="stat-value">
            {user?.data?.uid}
            <Icon 
              icon={copied ? "mdi:check" : "mdi:content-copy"} 
              className="copy-icon" 
              onClick={handleCopyUID}
              title={copied ? "Copied!" : "Copy UID"}
            />
          </span>
        </motion.div>
      </motion.div>

      {/* QR Code Section */}
      <motion.div 
        className="qr-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3 className="qr-title" variants={itemVariants}>
          QR Code
        </motion.h3>
        
        <motion.div className="qr-card" variants={itemVariants}>
          <div className="qr-code-wrapper">
            {/* Generate QR Code menggunakan email atau UID */}
            <QRCode 
              value={user?.data?.uid} 
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
          <h4 className="qr-user-name">{user?.data?.username}</h4>
          <p className="qr-user-email">{user?.data?.email}</p>
        </motion.div>
         <motion.div 
        className="log-out"
        variants={itemVariants}
      >
        <button onClick={handleLogout} className="log-out-btn"><Icon icon="bx:log-out" />Log Out</button>
      </motion.div>
      </motion.div>
     

      {/* Bottom Navigation (Placeholder jika belum diimport) */}
      <BottomNav />
    </div>
  );
};

export default Profile;