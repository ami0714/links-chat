import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatHome, getConversationChat, handlerMessage,getOtherUserInfo,createNewConversation } from '../api/chatApi';

export function useChatHome() {
    return useQuery({
        queryKey: ['chatHome'],
        queryFn: getChatHome,
        enabled: !!localStorage.getItem('token'),
        staleTime: 60000,
    });
}

export function useConversation(conversationId) {
    return useQuery({
        queryKey: ['chat', conversationId],
        queryFn: () => getConversationChat(conversationId),
        enabled: !!localStorage.getItem('token') && !!conversationId,
        staleTime: 10000,
    });
}

export function useChatHandle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ conversationId, body }) => {
            return await handlerMessage(conversationId, body);
        },

        onSuccess: ()=> {

            // Refresh senarai home (untuk last message + unread)
            queryClient.invalidateQueries({ queryKey: ['chat'] });
             queryClient.invalidateQueries({ queryKey: ['chatHome'] });
        },

        onError: () => {
            // Error is surfaced by the UI layer when needed.
        },
    });
}

export function useOtherUserInfo(uid) {
    return useQuery({
        queryKey: ['otherUser', uid],
        queryFn: () => getOtherUserInfo(uid),
        enabled: !!localStorage.getItem('token') && !!uid,
        staleTime: 60000,
    });
}

export function useCreateConversation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ uid, body }) => {
            return await createNewConversation(uid, body);
        },
        onSuccess: (response) => {
            navigate(`/chat/${response?.conversation_id}`);
            // Refresh senarai home (untuk last message + unread)
            queryClient.invalidateQueries({ queryKey: ['chatHome'] });
        },

        onError: () => {
            // Error is surfaced by the UI layer when needed.
        },
    });
}
        