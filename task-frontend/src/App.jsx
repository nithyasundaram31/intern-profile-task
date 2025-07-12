import React from 'react'
import { BrowserRouter, Navigate, Route, Routes}  from "react-router-dom"
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return(
    <BrowserRouter>
<Routes>
<Route path="/"  element={<Navigate to="/login"/>}/>
<Route path="/register"  element={<Register/>}/>
<Route path="/login" element={<Login/>}/>
<Route path='/profile'  element={<Profile/>}/>


</Routes>
<ToastContainer/>
  
  </BrowserRouter>


  
)
}
  
export default App