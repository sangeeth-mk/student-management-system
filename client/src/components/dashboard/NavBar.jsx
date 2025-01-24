import React from 'react'
import { useAuth } from '../../context/authContext'

const NavBar = () => {
  const {user,logout} = useAuth()

  const handleLogOut = ()=>{
    logout()
    localStorage.removeItem('token')
  }

  return (
    <div className='flex items-center text-white justify-between h-12 bg-teal-500 px-5'>
      <p className='ml-6 font-bold text-xl'>welcome {user.name}</p>
      <button className='px-4 py-1 bg-teal-700 hover:bg-teal-800' onClick={handleLogOut}>Logout</button>
    </div>
  )
}

export default NavBar
