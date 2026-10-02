import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import '../css/EditProfile.css';

// Dummy Data (berdasarkan struktur database users)
const dummyUser = {
  id: 1,
  name: 'User 2',
  username: 'User_2',
  email: 'AMifnia@gmail.com',
  avatar_file: 'profile_picture.jpg',
};

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

const EditProfile = () => {
  const [username, setUsername] = useState(dummyUser.username);
  const [avatarName, setAvatarName] = useState(dummyUser.avatar_file);

  const handleSave = () => {
    // Logik untuk save ke backend nanti
    console.log('Saving changes:', { username, avatarName });
  };

  return (
    <div className="ep-container">
      {/* Header Section */}
      <div className="ep-header">
        <div className="ep-header-top">
          {/* Butang Back: Tanpa Bulatan, Hanya Icon */}
          <button className="ep-back-btn">
            <Icon icon="mdi:chevron-left" />
          </button>
          
          <button className="ep-top-edit-btn">
            <Icon icon="mdi:pencil-outline" />
          </button>
        </div>
        
        <div className="ep-header-text">
          <span className="ep-header-subtitle">Links Chat</span>
          <h1 className="ep-header-title">Edit Profile</h1>
        </div>
      </div>

      {/* Profile Card (Atas) */}
      <motion.div 
        className="ep-profile-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="ep-avatar">
          <Icon icon="mdi:account" />
        </div>
        <div className="ep-user-info">
          <h2 className="ep-user-name">{dummyUser.name}</h2>
          <p className="ep-user-email">{dummyUser.email}</p>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div 
        className="ep-form"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Input Username */}
        <motion.div className="ep-form-group" variants={itemVariants}>
          <label className="ep-label">Username</label>
          <input
            type="text"
            className="ep-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </motion.div>

        {/* Input Profile Picture */}
        <motion.div className="ep-form-group" variants={itemVariants}>
          <label className="ep-label">Profile Picture</label>
          <div className="ep-input-wrapper">
            <input
              type="text"
              className="ep-input ep-input-file"
              value={avatarName}
              readOnly // Dibuat read-only kerana ini hanya paparan nama fail
            />
            <Icon icon="mdi:pencil-outline" className="ep-file-icon" />
          </div>
        </motion.div>

        {/* Butang Save */}
        <motion.button 
          className="ep-save-btn" 
          onClick={handleSave}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          SAVE CHANGES
        </motion.button>
      </motion.div>

      {/* Placeholder Bottom Nav (Untuk visual sahaja) */}
      <div className="ep-bottom-nav-placeholder">
        <Icon icon="mdi:home-outline" className="ep-nav-icon" />
        <Icon icon="mdi:qrcode-scan" className="ep-nav-icon" />
        <Icon icon="mdi:send" className="ep-nav-icon active" />
      </div>
    </div>
  );
};

export default EditProfile;