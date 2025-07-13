import React, { useContext, useState } from 'react'
import dp from '../assets/logo.jpeg'
import { dataContext } from '../Context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserStats() {
  let [Height, setHeight] = useState("");
  let [Weight, setWeight] = useState(0);
  let [BG, SetBG] = useState("");
  let {serverUrl, userData, setUserData} = useContext(dataContext);
  let navigate = useNavigate();
  const UpdateDetails = async(e)=>{
    e.preventDefault();
    try{
      let result = await axios.put(serverUrl + "/auth/getdetails",{
        Height,
        Weight,
        BG
      },{withCredentials:true});
      console.log(result.data.message);
      setUserData(result.data.message);
      navigate('/');
    
    }catch(error){
      console.log(error.response.data.message);
    }
  }
    
  return (
    <div className='w-full h-screen relative top-0 bg-gray-500 flex justify-center items-center'>
         <div className='w-full h-screen bg-white absolute opacity-[0.5] flex justify-center items-center'>
          
        </div>
          <div className='w-[400px] h-[600px] bg-white absolute z-[20] flex flex-col justify-start items-center gap-[10px] rounded-lg'>
            <div className='w-full h-[200px] flex flex-col justify-start items-center'>

                    <div className="w-[100px] h-[100px] rounded-[10px]  bg-gray-200 flex justify-center items-center gap-4">
                        <img src={dp} alt="" />
                    </div>
                    <p className="text-[#666] text-[0.95rem] mb-[30px] text-center">Store & share your medical records securely with your doctor.</p>
            </div>

            <form className='w-full h-[400px] flex flex-col justify-start items-center p-[10px] gap-[30px]' onSubmit={UpdateDetails}>
                <input type="text" placeholder='Enter your Height' value={Height} className='w-full h-[50px] px-[10px] border-2 border-gray-600 rounded-lg' onChange={(e)=>setHeight(e.target.value)} required/>
                 <input type="number" placeholder='Enter your Weight' className='w-full h-[50px] px-[10px] border-2 border-gray-600 rounded-lg' value={Weight} onChange={(e)=>setWeight(e.target.value)} required/>

                  <input type="text" placeholder='Enter your Blood Group' className='w-full h-[50px] px-[10px] border-2 border-gray-600 rounded-lg' value={BG} onChange={(e)=>SetBG(e.target.value)} required/>

                  <button className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] text-white border-none py-3 w-full rounded-[10px] text-[1rem] font-bold cursor-pointer transition-opacity duration-300 hover:opacity-95 mt-[20px]">Save details</button>
            </form>

            </div>
         </div>
       
  )
}

export default UserStats
