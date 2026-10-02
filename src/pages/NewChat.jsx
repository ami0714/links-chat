import React, { useState } from 'react';
import {NavLink,useSearchParams,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useOtherUserInfo,useCreateConversation} from '../hook/useChat'
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import '../css/NewChat.css';

// Variasi Animasi Framer Motion
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
};

const NewChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uidFromQR = searchParams.get('uid');
  const { register:message, handleSubmit,formState:{errors} } = useForm();
  const { data: otherUserInfo, isLoading } = useOtherUserInfo(uidFromQR);
  const displayName = otherUserInfo?.name || otherUserInfo?.username || uidFromQR || 'User';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

    const {mutate: createConversation } = useCreateConversation();
  const handleSend = (data) => {
    if (data.message) {
      createConversation({ uid: uidFromQR, body: { message: data.message } }, {
        
        onError: (err) => {
          alert('Gagal membuat perbualan baru:', err);
        }
      }
    );
    }
  

  };


  return (
    <div className="nc-container">
      {/* Header */}
      <div className="nc-header">
        <NavLink to="/home" className="chat-back-btn">
                    <Icon style={{ fontSize: '2em' }} icon="mdi:chevron-left" />
        </NavLink>
      </div>

      {/* Content Area */}
      <div className="nc-content">
        <motion.div 
          className="nc-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="nc-title" variants={itemVariants}>
            Start Chat
          </motion.h1>

          <motion.div className="nc-avatar" variants={itemVariants}>
            {isLoading ? '...' : otherUserInfo?.avatar_path ? (
              <img
                src={otherUserInfo?.avatar_path}
                alt={displayName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : initials}
          </motion.div>

          <motion.h2 className="nc-username" variants={itemVariants}>
            {isLoading ? 'Loading user...' : `@${otherUserInfo?.username || uidFromQR || 'unknown'}`}
          </motion.h2>

          <motion.div className="nc-input-wrapper" variants={itemVariants}>
            <form onSubmit={handleSubmit(handleSend)} className="nc-form">
            <input
              type="text"
              className="nc-input"
              placeholder="Type a message"
              {...message('message')}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            </form>
            <motion.button 
              className="nc-send-btn" 
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:send" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewChat;