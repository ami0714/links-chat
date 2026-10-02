import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../components/PrimaryButton.css'
const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="auth-custom-button"
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default Button;