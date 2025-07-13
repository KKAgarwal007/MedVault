import React, { useContext } from 'react'
import MedVaultDashboard from './components/MedVaultDashboard'
import Login from './components/Login'
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './components/SignUp';
import { dataContext } from './context/UserContext';
import UserStats from './components/UserStats';

function App() {
  let {userData, setUserData} = useContext(dataContext);
  return (
    <div>
      <Routes> 
        <Route path='/login' element={userData?<Navigate to={'/'}/>:<Login/>} />
        <Route path='/signup' element={userData?<Navigate to={'/'}/>:<Signup/>}/>
        <Route path='/' element={userData?<MedVaultDashboard/>:<Login/>} />
        <Route path='/update' element={<UserStats/>} />
      </Routes>
    </div>
  )
}

export default App
