import React, { createContext } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
export const dataContext = createContext();

function UserContext({children}) {
  let serverUrl = "http://localhost:8000"
  let [userData,setUserData] = useState(null);
  let getUserData = async ()=>{
  try{
    let result = await axios.get(serverUrl + '/auth/getuserdata',{
      withCredentials:true
    })
    console.log(result.data.message);
    setUserData(result.data.message);
  }catch(error){
    console.log(error.response.data.message);
    setUserData(null);
  }
}

useEffect(()=>{
  getUserData();
},[])

let value = {
  serverUrl,userData,setUserData
}
  return (
    <dataContext.Provider value={value}>
        {children}
    </dataContext.Provider>
  )
}

export default UserContext