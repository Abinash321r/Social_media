import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import socket from '../socket/socket';
function FriendPanel() {

  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  const {userinfo,friendsinfo,pendingfriendRequestsinfo}=useSelector((state)=>state.auth)

  const [keyword,setKeyword]=useState('')
  const [foundUsers,setFoundUsers]=useState('')

  const handlechange =(e)=>{
    setKeyword(e.target.value)
    console.log(e.target.value)
  }

  const handlesubmit=async(e)=>{
    console.log(keyword)
    e.preventDefault()
    if(keyword==''){
      setFoundUsers('')
    }
 
    const response = await fetch(`${socketUrl}/search_user/${keyword}`,
      {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    
    if(response.ok){
     const result = await response.json()
      console.log(result?.data)
      setFoundUsers(result?.data)
    }
  
  }
  
 const handleFriendRequest = (e,receiver) =>{
  e.preventDefault()
  console.log('sender receiver',userinfo?.user?._id,receiver)
 socket.emit("sendFriendRequest",{sender: userinfo?.user?._id, receiver:receiver })
 }

 const handleFriendRequestAccept =(e,id,sender,receiver)=>{
  e.preventDefault()
  socket.emit("acceptFriendRequest",{friendrequestId: id,sender:sender, receiver:receiver})
 }
 const handleFriendRequestDelete =(e,id,sender,receiver)=>{
  e.preventDefault()
  socket.emit("deleteFriendRequest",{friendrequestId: id,sender:sender, receiver:receiver})
 }

  return (
    <div class='p-3 bg-slate-100' >
      <h1 class='text-xs text-slate-500 mb-2 font-semibold' >FIND FRIENDS</h1>
      <form class='flex flex-row gap-2'>
      <input  onChange={handlechange}  class='w-full text-sm px-3 py-2 border border-slate-400 rounded-lg bg-white' type="text" placeholder='Search by name or email' />
      <button onClick={handlesubmit} class='text-white bg-blue-600 font-medium rounded-md px-3 py-2 cursor-pointer text-sm' >Search</button>
      </form>

      {foundUsers&&(
        <div class='max-h-40 overflow-y-auto bg-white mt-2 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-slate-300' >
          {
            foundUsers.map((item,index)=>{
              return(
                <>
                <div class='px-3 py-1.5  flex justify-between border border-b border-slate-100 items-center'>
                  <div>
                    <p class='font-medium text-slate-800'>{item.name}</p>
                    <p class='text-xs text-slate-800'>{item.email}</p>
                  </div>
                  <span>
                    {
                      (userinfo.user._id===item._id)?<p class='text-xs text-emerald-600'>You</p>:
                      (friendsinfo.some(user=>user._id===item._id))?<p class='text-xs text-emerald-600'>Friend</p>:<button onClick={(e)=>handleFriendRequest(e,item?._id)} class='text-xs cursor-pointer px-2 py-1  bg-slate-800 text-white hover:bg-slate-900 rounded-md'>Add</button>
                    }
                  </span>
                </div>
                </>
              )
            })
          }

        </div>
      )}



      <h1 class='text-xs text-slate-500 mt-4 mb-2 font-semibold'>FRIEND REQUESTS</h1>
      {pendingfriendRequestsinfo?(
      <>
       <div class='max-h-40 overflow-y-auto bg-white mt-2 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-slate-300' >
      {
        pendingfriendRequestsinfo.map((item,index)=>{
          return(
            <>
            <div class='px-3 py-1.5  flex justify-between border border-b border-slate-100 items-center'>
              <div class='flex flex-row gap-1'>
                <img class='w-7 h-7 object-cover rounded-full' src={item?.sender?.profilePic} alt="" />
                <p class='font-medium'>{item?.sender?.name}</p>
              </div>
              <div class='flex flex-row gap-2'>
                <button onClick={(e)=>handleFriendRequestAccept(e,item?._id,item?.sender?._id,item?.receiver)} class='bg-emerald-600 text-xs text-white px-2 py-1 rounded-md cursor-pointer' >Accept</button>
                <button onClick={(e)=>handleFriendRequestDelete(e,item?._id,item?.sender?._id,item?.receiver)}  class='text-xs text-slate-700 border border-slate-400 rounded-md cursor-pointer px-2 py-1' >Decline</button>
              </div>
            </div>
            </>
          )
        })
      }
      </div>
      </>)
      :(<p class='text-xs text-slate-500'>No pending Reuests</p>)}

    </div>
  )
}

export default FriendPanel