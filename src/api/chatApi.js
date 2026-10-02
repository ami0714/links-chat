import {get,post } from '../utils/apiHelper';





export async function getChatHome(){
      
    const response = await get('/chat');

    if (response?.status === true) {
         return Array.isArray(response?.dataChat) ? response.dataChat : [];
    }

    throw new Error(response?.message || 'Gagal mendapatkan senarai perbualan');
   
  
}

export async function getConversationChat(conversationId){
      
    const response = await get(`/chat/${conversationId}`);

    if (response.status == true) {
         return response
    }

    return {
        message : 'error'
    }
   
  
}


export async function handlerMessage(conversationId,body){
    const response = await post(`/chat/message/${conversationId}`,body);

    if (response.status === true) {
        return response;
    }

    if (response.status === false) {
        throw new Error(response.message || 'Gagal menghantar mesej');
    }

    return {
        message:'error send message'
    }
}


//proses nak create new conversation, kalau dah ada conversation id, just hantar message je

//dapatkan data user lain, untuk display nama dan avatar, kalau takde data user lain, just display uid je

export async function getOtherUserInfo(uid){
    const response = await get(`/user/other?uid=${uid}`);
    if(response.status === true){
        return response.dataUser
    }

    if(response.status === false){
        throw new Error(response.message || 'Gagal mendapatkan maklumat pengguna lain');
    }

}

export async function createNewConversation(uid,body){
    const response = await post(`/chat/conversation/new?uid=${uid}`,body);

    if(response.status === true){
        return response
    }
    if(response.status === false){
        throw new Error(response.message || 'Gagal membuat perbualan baru');
    }
}