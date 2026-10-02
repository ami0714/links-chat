import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { getEcho } from '../lib/echo';
import { useConversation, useChatHandle } from '../hook/useChat';
import '../css/Chat.css';

const bubbleVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

const Chat = () => {
    const { conversationId } = useParams();
    const queryClient = useQueryClient();

    const { data: chatData, isLoading } = useConversation(conversationId);

    const { register: chatMessage, handleSubmit, reset } = useForm();
    const { mutate } = useChatHandle();

    const bottomRef = useRef(null);

    // ============================================
    // Hantar mesej
    // ============================================
    const handleMessage = (data) => {
        if (!data?.message?.trim() || !conversationId) return;

        mutate({ conversationId, body: data });
        reset()
    };

    // ============================================
    // Listen real-time (untuk mesej dari user lain)
    // ============================================
    useEffect(() => {
        if (!conversationId) return;

        const echo = getEcho();
        if (!echo) return;

        const channel = echo.private(`conversation.${conversationId}`);

        channel.listen('.message.sent', (e) => {
            console.log('Mesej baru diterima:', e);

            queryClient.invalidateQueries({ queryKey: ['chatHome'] });

            // Update cache TanStack Query
            queryClient.setQueriesData({ queryKey: ['chatHome',conversationId] }, (old) => {
                if (!old) return old;

                const updated = old.map((conv) =>
                    conv.conversation_id === conversationId
                        ? {
                            ...conv,
                            last_message_body: e.body,
                            last_message_at_actual: e.created_at,
                        }
                        : conv
                );

                updated.sort(
                    (a, b) =>
                        new Date(b.last_message_at_actual) -
                        new Date(a.last_message_at_actual)
                );
                return updated;
            });

            queryClient.setQueryData(
                ['chat', conversationId],
                (old) => {
                    if (!old) return old;

                    // Elak duplicate
                    if (old.chat.some((m) => m.id === e.id)) return old;

                    return {
                        ...old,
                        chat: [
                            ...old.chat,
                            {
                                id: e.id,
                                user_id: e.sender_id,
                                body: e.body,
                                sender: 'them',   // sebab toOthers() — yang terima bukan sender
                                created_at: e.created_at,
                            },
                        ],
                    };
                }
            );
        });

        // Cleanup
        return () => {
            echo.leave(`conversation.${conversationId}`);
        };
    }, [conversationId, queryClient]);

    // ============================================
    // Auto scroll bila bilangan mesej berubah
    // ============================================
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData]);

    // ============================================
    // Data sedia
    // ============================================
    const messages = chatData?.chat ?? [];
    const otherUser = chatData?.otherUser;

    const avatarInitial = otherUser?.username
        ? otherUser.username.charAt(0).toUpperCase()
        : '?';

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chatting-header">
                <NavLink to="/home" className="chat-back-btn">
                    <Icon style={{ fontSize: '2em' }} icon="mdi:chevron-left" />
                </NavLink>

                <div className="header-avatar">{avatarInitial}</div>
                <span className="header-username">
                    @{otherUser?.username ?? 'unknown'}
                </span>
            </div>

            {/* Body */}
            {isLoading ? (
                <div className="chat-body">
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="chat-body">
                    {messages.map((msg) => {
                        const isIncoming = msg.sender === 'them';

                        return (
                            <motion.div
                                key={msg.id}
                                className={`message-row ${isIncoming ? 'incoming' : 'outgoing'}`}
                                variants={bubbleVariants}
                                initial="hidden"
                                animate="visible"
                                layout
                            >
                                {isIncoming && <div className="avatar-small"></div>}

                                <div className="bubble">{msg.body}</div>
                            </motion.div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
                <form onSubmit={handleSubmit(handleMessage)}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message"
                        autoComplete="off"
                        {...chatMessage('message', { required: true })}
                    />
                    <button type="submit" className="send-btn">
                        <Icon icon="mdi:send" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;