import React, { createContext, useContext, useEffect, useState } from 'react';
import Axios from 'axios';

const UserContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const verifyUser = async ()=>{

      const token = localStorage.getItem('token')

       try { 
        
        const response = await Axios.get('http://localhost:3007/api/auth/verify',
        {
          headers:{ 
            Authorization:`Bearer ${token}`
          },
        })
        console.log(response);
        if(response.data.success){
          setUser(response.data.user)
        }else{
          setUser(null)
          setLoading(false)
        }

       } catch (error) {
        console.log(error);
        if(error.response && !error.response.data.error){
          setUser(null)
        }
       } finally{
        setLoading(false)
       }
    }

    verifyUser()
  },[])

  const login = () => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => {
  return useContext(UserContext);
};

export { AuthProvider, useAuth };
