import {get } from '../utils/apiHelper';

import { post,del } from "../utils/apiHelper";

export function logUser(dataUser){
      
    return post('/login',dataUser)
  
}

export function registerUser(body){
   

    return post('/register',body);

}


/*reset pass */



export async function getEmail(email){
    const body ={
        email:email
    }
     
try {
    const res = await post('/forgot-password',body)
    return res.status
} catch (error) {
    console.log(error)
}
}


export async function SetNewPass(token,email, password,password_confirmation){
    const body = {
        token:token,
        email:email,
        password:password,
        password_confirmation:password_confirmation
    }

    try {
    const res = await post('/reset-password',body)
    return res.status
} catch (error) {
    console.log(error)
}
}

