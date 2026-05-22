import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {viewProfileModel} from '../store/modelOpeningSlice'
function ViewProfileModel() {
     const dispatch = useDispatch();
     const {userinfo}=useSelector((state)=>state.auth)
  return (
       <div class=' fixed inset-0 z-40 w-full h-full flex items-center justify-center bg-black/40'>
         <div class='w-sm sm:w-[clamp(12rem,55vw,28rem)] p-5 rounded-lg shadow-lg bg-white'>
           <div class='flex justify-between mb-4 items-center'>
             <h1 class='font-semibold text-lg' >Your Profile</h1>
             <button class='text-3xl cursor-pointer' onClick={() => dispatch(viewProfileModel(false))}>&times;</button>
           </div>
           <div>
             <div class='flex items-center p-2 justify-center'>
                <img class='w-14 h-14 object-cover rounded-full' src={userinfo?.user?.profilePic} alt="" />
             </div>
             <div class='p-2 flex flex-col bg-slate-50 rounded-ms' >
                <p class='text-xs text-slate-500' >Name</p>
                <p>{userinfo?.user?.name}</p>
             </div>
             <div class='p-2 flex flex-col bg-slate-50 rounded-md'>
                <p class='text-xs text-slate-500' >Email</p>
                <p>{userinfo?.user?.email}</p>
             </div>
           </div>
           
         </div>
       </div>
  )
}

export default ViewProfileModel