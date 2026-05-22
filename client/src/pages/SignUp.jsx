import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from '../store/authSlice';

function SignUp() {

  const usernameRegex = /^[a-zA-Z\s]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,}$/;
  const emailRegex = /^[^\s@]+@gmail\.com$/;;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signupLoading, setSignUpLoading]=useState(false)

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null
  });
  const [errorComponent, SetErrorComponent] = useState(false);


  const handlechange = (e) => {
    const { name, value, files, type } = e.target;
    console.log(user)
    setUser({ ...user, [name]: type == 'file' ? files[0] : value })
  }


  const handlesubmit = async (e) => {
    console.log("submitt called1")
    e.preventDefault()
    console.log(user)
    if (((usernameRegex.test(user.name) == false)) || ((passwordRegex.test(user.password) == false)) || ((emailRegex.test(user.email) == false))) {
      SetErrorComponent(true);
      return;
    }
    console.log("submitt called2")
    setSignUpLoading(true)
    try {
      const data = new FormData();
      data.append("username", user.username);
      data.append("email", user.email);
      data.append("password", user.password);
      data.append("profilePic", user.profilePic);
      const response = await fetch(`${socketUrl}/signupdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        }
      )
      console.log('messsage', response)
      if (response.ok) {
        signupLoading(false)
        await dispatch(checkAuth())
        navigate("/");
      }
    } catch (err) {
      SetErrorComponent(true)
      setSignUpLoading(false)
    }
  }

  return (
    <div className='signup_wrapper w-full h-full bg-slate-200 flex items-start justify-center' >
      <div className='signup_container my-auto sm:mt-16 mx-auto w-[clamp(400px,60vw,500px)] aspect-video flex flex-col shadow-lg bg-white p-[clamp(0.8rem,2vw,3rem)] rounded-sm'>
        <h1 className='text-2xl mb-4 font-bold'>SignUp</h1>
        <form action="" className='flex flex-col space-y-2 sm:space-y-3'>
          <input onChange={(e) => handlechange(e)} name='name' type="text" placeholder='Username' className='w-full border border-slate-300  rounded-sm p-2' />
          <input onChange={(e) => handlechange(e)} name='email' type="text" placeholder='Email' className=' w-full border border-slate-300  rounded-sm p-2' />
          <input onChange={(e) => handlechange(e)} name='password' type="text" placeholder='Password' className='w-full border border-slate-300 rounded-sm p-2' />
          <input onChange={(e) => handlechange(e)} name='profilePic' type="file" className='w-full  border border-slate-300 rounded-sm p-2 file:border file:p-1 file:border-slate-400 file:rounded-sm file:cursor-pointer file:bg-gray-200' />
          {errorComponent && (<p className='text-red-500 p-2'>SignUp Failed</p>)}
          <button onClick={(e) => handlesubmit(e)} className='w-full bg-blue-600 text-white rounded-sm p-2 cursor-pointer' >{signupLoading ? "Creating account..." : "SignUp"}</button>
        </form>
        <p className='mt-3 text-sm'>Already have Account? <a href='/login' className='text-blue-600 cursor-pointer'>Login</a></p>
      </div>

    </div>
  )
}

export default SignUp