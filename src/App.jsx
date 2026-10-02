import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'
import Auth from './pages/auth'
import Home from './pages/home'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Scan from './pages/Scan'
import NewChat from './pages/NewChat'
import ProtectedRoute from './protectedRoute'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AuthContextProvider from './context/authContext';
import './App.css'



function App() {
  const queryclient = new QueryClient()
  return (
    <QueryClientProvider client={queryclient}>
    <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
        <Route path='/home' element={< Home />} />
        <Route path='/chat/:conversationId' element={< Chat />} />
        <Route  path='/profile' element={<Profile />} />
        <Route  path='/EditProfile' element={<EditProfile />} />
       <Route  path='/scan' element={<Scan />} />
       <Route  path='/chat/new' element={<NewChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App
