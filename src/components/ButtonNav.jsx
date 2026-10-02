import React from 'react';
import {useNavigate,useLocation,NavLink} from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import '../components/ButtonNav.css';

const BottomNav = () => {
  const navItems = [
    { icon: 'mdi:home-outline', navigate: '/home' },
    { icon: 'mdi:qrcode-scan', navigate: '/scan' },
    { icon: 'mdi:account', navigate: '/profile' },
  ];

  return (
    <div className="bottom-nav-bar">
      {navItems.map((item, index) => (
        <motion.div key={index} whileTap={{ scale: 0.9 }}>
          <NavLink
            to={item.navigate}
            className={({ isActive }) => `bottom-nav-icon ${isActive ? 'bottom-nav-icon-active' : ''}`}
          >
            <Icon icon={item.icon} />
          </NavLink>
        </motion.div>
      ))}
    </div>
  );
};


export default BottomNav;