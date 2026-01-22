import axios from 'axios'
import React, { useEffect } from 'react'
import { FcGoogle } from "react-icons/fc"
import { useLocation, useNavigate } from 'react-router-dom'

const GoogleLogin = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
   window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self")
   
  }

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search)
  //   const token = params.get("token")
  //   const encodedUser = params.get("user")

  //   if (token && encodedUser) {
  //     try {
  //       const decodeData = atob(encodedUser)
  //       const userData = JSON.parse(decodeData)

  //        console.log(decodeData);
  //       console.log(userData);

  //       localStorage.setItem("token", token)
  //       localStorage.setItem("user", JSON.stringify(userData))


  //       navigate('/login', { replace: true });

  //     } catch (error) {
  //       console.error('Error decoding user data or parsing JSON:', error);

  //     }
  //   }
  // }, [location, navigate])



  return (
    <>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        style={{ backgroundColor: "transparent" }}
      >
        <FcGoogle size={24} />
        <span className="font-medium text-gray-700">Login with Google as a student</span>
      </button>
      <button
        onClick={handleGoogleLogin}
        className="flex mt-2 items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        style={{ backgroundColor: "transparent" }}
      >
        <FcGoogle size={24} />
        <span className="font-medium text-gray-700">Login with Google as a instructor</span>
      </button>
    </>
  )
}

export default GoogleLogin