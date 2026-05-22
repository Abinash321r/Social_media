import React from 'react'
import { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import ProfileMenu from './ProfileMenu';
import socket from '../socket/socket';
import { logoutAuth } from '../store/authSlice';
import { logoutChatWindow } from '../store/chatWindowSlice';
import { logoutModelOpening } from '../store/modelOpeningSlice';

function Navbar() {

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const { userinfo } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [profileMenu, setProfileMenu] = useState(false)

    const handlelogout = async () => {
        const response = await fetch(`${socketUrl}/logout`, { method: "POST", credentials: 'include' })
        if (response.ok) {
            console.log(response)
            socket.disconnect();
            dispatch(logoutAuth())
            dispatch(logoutChatWindow())
            dispatch(logoutModelOpening())
            navigate('/login')
        }
    }

    return (
        <>
            <nav class='flex  justify-between items-center px-4 py-3 border-b border-slate-300'>
                <h1 class='text-xl font-semibold'>Chat App</h1>
                <div class='relative  flex items-center gap-2'>
                    <button class='h-10 cursor-pointer' onClick={() => setProfileMenu(!profileMenu)} ><img class='h-full aspect-square rounded-full object-cover ' src={userinfo?.user?.profilePic} alt="" /></button>
                    <button onClick={handlelogout} class=' h-10 text-white bg-black rounded-md px-3 py-2 cursor-pointer'>Logout</button>
                    {profileMenu && (<ProfileMenu />)}
                </div>
            </nav>
        </>
    )
}

export default Navbar