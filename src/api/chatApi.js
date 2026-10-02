import {get,post } from '../utils/apiHelper';





export async function getChatHome(){
      
    const response = await get('/chat');

    if (response?.status === true) {
         return Array.isArray(response?.dataChat) ? response.dataChat : [];
    }

    throw new Error(response?.message || 'Failed to get conversation list');
   
  
}

export async function getConversationChat(conversationId){
      
    const response = await get(`/chat/${conversationId}`);

    if (response.status == true) {
         return response
    }

    return {
        message : 'Error'
    }
   
  
}


export async function handlerMessage(conversationId,body){
    const response = await post(`/chat/message/${conversationId}`,body);

    if (response.status === true) {
        return response;
    }

    if (response.status === false) {
        throw new Error(response.message || 'Failed to send message');
    }

    return {
        message:'Error sending message'
    }
}


// Process to create a new conversation; if a conversation ID already exists, just send a message.
// Get the other user data to display the name and avatar; if there is no other user data, just display the UID.

export async function getOtherUserInfo(uid){
    const response = await get(`/user/other?uid=${uid}`);
    if(response.status === true){
        return response.dataUser
    }

    if(response.status === false){
        throw new Error(response.message || 'Failed to get other user information');
    }

}

export async function createNewConversation(uid,body){
    const response = await post(`/chat/conversation/new?uid=${uid}`,body);

    if(response.status === true){
        return response
    }
    if(response.status === false){
        throw new Error(response.message || 'Failed to create a new conversation');
    }
}