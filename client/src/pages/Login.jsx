import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch }from "react-redux";
import { checkAuth } from '../store/authSlice';
import Swal from "sweetalert2";

function Login() {

  const usernameRegex = /^[a-zA-Z\s]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [loginLoading, setLoginLoading]=useState(false)

    const [user,setUser]=useState({
      name:"rameshwor",
      email:"test1@gmail.com",
      password:"pass1!",
    });
    const [errorComponent,SetErrorComponent]=useState(false);
  

    const handlechange=(e)=>{
       const { name, value } = e.target;
       console.log(user)
      setUser({...user,[name] : value})
    }


    const handlesubmit = async (e)=>{
      console.log("submitt called1")
      e.preventDefault()
      console.log(user)
      if (((usernameRegex.test(user.name)==false))||((passwordRegex.test(user.password)==false))||((emailRegex.test(user.email)==false))){
        SetErrorComponent(true);
        return;
      }
      console.log("submitt called2")
      setLoginLoading(true)
      try{
      const response= await fetch(`${socketUrl}/logindata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        }
      )
      console.log('messsage',response.messagage)
      if (response.ok) { 
        setLoginLoading(false)
       await dispatch(checkAuth())
        navigate("/");
       }
    }catch(err){
      SetErrorComponent(true)
      setLoginLoading(false)
    }
    }
  useEffect(()=>{
    const alreadyShown = sessionStorage.getItem("cookies_popup_shown"); 
  if (!alreadyShown) {
    setTimeout(() => {
    Swal.fire({
      toast: true,
      position: "bottom",
      icon: "info",
      title: "Cookies Required",
      text: "Please Check and Enable third-party cookies to access all features.\n Some features may not work properly otherwise.",
      showConfirmButton: false,
      timer: 30000,
      timerProgressBar: true,
    })
    }, 100)
sessionStorage.setItem("cookies_popup_shown", "true");
  }
  },[])

  return (
  <div className='login_wrapper w-full h-full bg-slate-200 flex items-start justify-center' >
  <div className='login_container my-auto sm:mt-16 mx-auto w-[clamp(400px,60vw,500px)] aspect-video flex flex-col shadow-lg bg-white p-[clamp(0.8rem,2vw,3rem)] rounded-sm'>
    <h1 className='text-2xl mb-4 font-bold'>Login</h1>
    <form action="" className='flex flex-col space-y-2 sm:space-y-3'>
      <input onChange={handlechange} value={user?.name} name='name' type="text" placeholder='Username' className='w-full border border-slate-300  rounded-sm p-2'/>
      <input onChange={handlechange} value={user?.email} name='email' type="text" placeholder='Email' className=' w-full border border-slate-300  rounded-sm p-2'/>
      <input onChange={handlechange} value={user?.password} name='password' type="text" placeholder='Password' className='w-full border border-slate-300 rounded-sm p-2' />
      {errorComponent&&(<p className='text-red-500 p-2'>Login Failed</p>)}
      <button onClick={handlesubmit} className='w-full bg-blue-600 text-white rounded-sm p-2 cursor-pointer' >{loginLoading?'Loggin in...':'Login'}</button>
    </form>
    <p className='mt-3 text-sm'>No Account? <a href='/signup' className='text-blue-600 cursor-pointer'>SignUp</a></p>
  </div>
</div>
  )
}

export default Login
