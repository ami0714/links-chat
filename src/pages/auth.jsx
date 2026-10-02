import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputField from '../components/InputField'
import Button from '../components/PrimaryButton';
import { Icon } from '@iconify/react';
import {useForm} from 'react-hook-form'
import {useLogin,useRegister} from '../hook/useLogin';
import '../css/auth.css';








// --- Main Auth Component ---

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  
  const {register:AuthForm,handleSubmit,reset} = useForm();
  const {mutate:loginMutate} = useLogin();
  const {mutate:registerMutate} = useRegister();

  const handleAuth = (data)=>{
    if(!isLogin){
      registerMutate(data,{
        onSuccess:(data)=>{
          alert("Register berjaya")
           reset()
           setIsLogin(true);
           
        },
        onError:(err) => {
          alert("errpr register" + err?.message);
        }
      })
    }else{
     loginMutate(data);
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset()
  };

  // Variasi Animasi Framer Motion
  const pageVariants = {
    initial: { opacity: 0, x: isLogin ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? 20 : -20 },
  };

  return (
    <div className="auth-container">
      {/* Logo Utama di atas Card */}
      <div className="logo-text">
        <span className="purple">Links</span> <span className="black">Chat</span>
      </div>

      <div className="auth-card">
        <AnimatePresence mode="wait">
          {isLogin ? (
            // --- TAMPILAN LOGIN ---
            <motion.div
              key="login"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <h2 className="card-title">Login to Chat</h2>
              </div>
              <form onSubmit={handleSubmit(handleAuth)} >
              <InputField
                label="Email"
                icon="mdi:email-outline"
                type="email"
                placeholder="Enter your email"
                {...AuthForm("email",{required: "email requared"})}
                
              />

              <InputField
                label="Password"
                icon="mdi:lock-outline"
                type="password"
                placeholder="Enter your password"
                {...AuthForm("password",{required: "password requared"})}
              />

              <Button type="submit">Login</Button>
              </form>

              <div className="card-footer">
                Don't have an account?{' '}
                <a onClick={toggleAuthMode}>Register</a>
              </div>
            </motion.div>
          ) : (
            // --- TAMPILAN REGISTER ---
            <motion.div
              key="register"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <div className="card-subtitle">Links Chat</div>
                <h2 className="card-title">Register to Chat</h2>
              </div>

              {/* Info Box khusus di halaman Register */}
              <div className="info-box">
                <div className="info-icon">
                  <Icon icon="mdi:account-circle" />
                </div>
                <div className="info-text">
                  <h4>Links Chat</h4>
                  <p>Create your account to start chatting</p>
                </div>
              </div>
             <form onSubmit={handleSubmit(handleAuth)}  >
              <InputField
                label="Email"
                icon="mdi:email-outline"
                type="email"
                placeholder="Enter your email"
                {...AuthForm("email",{required: "email requared"})}
              />

              <InputField
                label="name"
                icon="mdi:account-outline"
                type="text"
                placeholder="Choose a username"
                {...AuthForm("name",{required: "name required"})}
              />

              <InputField
                label="Username"
                icon="mdi:account-outline"
                type="text"
                placeholder="Choose a username"
                {...AuthForm("username",{required: "username required"})}
              />

              <InputField
                label="Password"
                icon="mdi:lock-outline"
                type="password"
                placeholder="Create a password"
                {...AuthForm("password",{required: "password requared"})}
              />
               <InputField
                label="Confirm Password"
                icon="mdi:lock-outline"
                type="password"
                {...AuthForm("password_confirmation",{required:"password_confirmation is required"})}
                
              />

              <Button type="submit">Register</Button>
              </form>

              <div className="card-footer">
                Already have an account?{' '}
                <a onClick={toggleAuthMode}>Login</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;