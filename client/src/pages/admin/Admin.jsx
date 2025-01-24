import React from 'react'
import { useAuth } from '../../context/authContext'
import AdminSideBar from '../../components/dashboard/AdminSideBar'
import NavBar from '../../components/dashboard/NavBar'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  const {user} = useAuth()

  return (
    <div className='flex'>
      <h1>admin is {user.name}</h1>
      <h1>hyyy</h1>
      <AdminSideBar/>
      <div className='flex-1 h-screen ml-[111px]'>
    <NavBar/> 
    
    <Outlet/>
    </div>
    </div>
  )
}

export default Admin
