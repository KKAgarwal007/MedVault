import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dp from '../assets/logo.jpeg'
import axios from 'axios';
import { dataContext } from '../Context/UserContext';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const {serverUrl,userData,setUserData} = useContext(dataContext);
  

  const handleSignup = async(e) => {
    e.preventDefault();
    
    // Validate passwords match
    try{
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

      let result = await axios.post(serverUrl + "/auth/signup",{
        email,
        password
      },{withCredentials:true});
        console.log(result)
        navigate('/update');
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#dfefff] to-[#f0f4ff] flex items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute rounded-full filter blur-[100px] opacity-40 w-[500px] h-[500px] bg-[#6e8efb] -top-[100px] -left-[150px] animate-blob"></div>
      <div className="absolute rounded-full filter blur-[100px] opacity-40 w-[400px] h-[400px] bg-[#a777e3] -bottom-[100px] -right-[100px] animate-blob"></div>
      <div className="absolute rounded-full filter blur-[100px] opacity-40 w-[300px] h-[300px] bg-[#00c9ff] top-[200px] right-[100px] animate-blob"></div>

      <div className="bg-white p-10 rounded-[20px] shadow-lg max-w-[400px] w-full text-center">
        <div className="flex items-center justify-center mb-5">
          {/* Replace with your actual logo */}
          <div className="w-[50px] h-[50px] rounded-[10px] mr-[10px] bg-gray-200">
            <img src={dp} alt="" />
          </div>
          <h2 className="font-semibold text-[#1b2e5a]">MedVault</h2>
        </div>
        <p className="text-[#666] text-[0.95rem] mb-[30px]">Create an account to store & share your medical records securely.</p>

        <form onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full p-3 my-[10px] border border-[#ccc] rounded-[10px] text-[1rem]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Create a password" 
            className="w-full p-3 my-[10px] border border-[#ccc] rounded-[10px] text-[1rem]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm your password" 
            className="w-full p-3 my-[10px] border border-[#ccc] rounded-[10px] text-[1rem]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex justify-start text-[0.85rem] mb-5 text-[#555]">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mr-1"
                required
              /> 
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button 
            type="submit"
            className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] text-white border-none py-3 w-full rounded-[10px] text-[1rem] font-bold cursor-pointer transition-opacity duration-300 hover:opacity-95"
          >
            → Sign Up
          </button>
        </form>

        <div className="mt-[15px] text-[0.85rem]">
          Already have an account? <a href="#" className="text-[#6e8efb] no-underline" onClick={()=>navigate('/login')}>Log in</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
