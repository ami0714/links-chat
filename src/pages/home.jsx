import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import BottomNav from '../components/ButtonNav';
import {useAuth} from '../context/authContext'
import { getEcho } from '../lib/echo'
import {useQueryClient} from '@tanstack/react-query'
import {useChatHome} from '../hook/useChat';
import '../css/home.css';
import {useNavigate} from 'react-router-dom';



// Variasi Animasi untuk list
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};




const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const {user,isLoading,error} = useAuth();
    const {data:chat,isLoading:isChatLoad,isError:isChatError,error:chatError} = useChatHome();
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    //amik username dari data user, kalau takde username, guna uid
    //includes cek adakah search ade dalam username, kalau takde, return false
    //dalam filter ialah syarat untuk return true, kalau true, masukkan dalam array baru
    const filteredChats = Array.isArray(chat)
      ? chat.filter((conversation) =>
          `${conversation?.username || ''} `
            .toLocaleLowerCase()
            .includes(normalizedSearch)
        )
      : [];

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    if(!chat) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `user.${userId}`;
    const channel = echo.private(channelName);

    channel.listen('.message.sent', (event) => {
      let shouldRefetch = false;

      queryClient.setQueryData(['chatHome'], (old) => {
        if (!Array.isArray(old)) {
          shouldRefetch = true;
          return old;
        }

        const hasConversation = old.some(
          (conversation) => conversation.conversation_id === event.conversation_id
        );
        if (!hasConversation) {
          shouldRefetch = true;
          return old;
        }

        return old
          .map((conversation) =>
            conversation.conversation_id === event.conversation_id
              ? {
                  ...conversation,
                  last_message_body: event.body,
                  last_message_at_actual: event.created_at,
                  last_message_sender_id: event.sender_id,
                }
              : conversation
          )
          .sort(
            (a, b) =>
              new Date(b.last_message_at_actual) -
              new Date(a.last_message_at_actual)
          );
      });

      if (shouldRefetch) {
        queryClient.invalidateQueries({ queryKey: ['chatHome'] });
      }
    });

    return () => {
      echo.leave(channelName);
    };
  }, [queryClient, user?.id]);

  



  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="top-bar">
          <h1 className="home-header-title">Links Chat</h1>
          <div className="user-profile">
            <span>{user?.data?.username || 'user'}</span>
            <div className="profile-icon-wrapper">
              <Icon icon="mdi:account" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Icon icon="mdi:magnify" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <motion.div
        className="chat-list"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {isChatLoad ? (
          <motion.div className="no-chat-message" variants={itemVariants}>
            Memuatkan perbualan...
          </motion.div>
        ) : isChatError ? (
          <motion.div className="no-chat-message" variants={itemVariants}>
            {chatError?.message || 'Gagal memuatkan perbualan.'}
          </motion.div>
        ) : !Array.isArray(chat) || chat.length === 0 ?(
          <motion.div className="no-chat-message" variants={itemVariants}>
            Tiada perbualan dijumpai.
          </motion.div>
        ) : filteredChats.length === 0 ? (
          <motion.div className="no-chat-message" variants={itemVariants}>
            Tiada perbualan sepadan dengan carian.
          </motion.div>
        ) : (
         filteredChats.map((conversation,index) => (
          <motion.div
            key={conversation?.conversation_id || index}
            className="chat-item"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={()=> navigate(`/chat/${conversation?.conversation_id}`)}
          >
            <div className="avatar">{conversation?.username?.[0] || '?'}</div>
            <div className="chat-content">
              <div className="chat-header">
                <span className="chat-name">{conversation?.username}</span>
                <span className="chat-time">{conversation?.last_message_at_actual}</span>
              </div>
              <p className="chat-message">{conversation?.last_message_body}</p>
            </div>
          </motion.div>
  ))
        )}
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;