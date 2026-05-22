import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { profileEditModel } from '../store/modelOpeningSlice'
import { updateUserInfo } from '../store/authSlice'
function ProfileEditModel() {
  const { userinfo } = useSelector((state) => state.auth)


  const usernameRegex = /^[a-zA-Z\s]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,}$/;
  const emailRegex = /^[^\s@]+@gmail\.com$/;;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: userinfo?.user?.name,
    email: userinfo?.user?.email,
    profilePic: null
  });
  const [saveChangeloading,setSaveChangeLoading]=useState(false)
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
    if (((usernameRegex.test(user.name) == false)) || ((emailRegex.test(user.email) == false))) {
      SetErrorComponent(true);
      return;
    }
    console.log("submitt called2")
    setSaveChangeLoading(true)
    try {
      const data = new FormData();
      data.append("name", user.name);
      data.append("email", user.email);
      data.append("profilePic", user.profilePic);

      const response = await fetch(`${socketUrl}/update_profile`,
        {
          method: "PUT",
          credentials: "include",
          body: data,
        }
      )
      console.log('messsage', response)
      if (response.ok) {
       const  result = await response.json()
        console.log(result?.user)
        setSaveChangeLoading(false)
        dispatch(updateUserInfo(result))
      }
    } catch (err) {
      SetErrorComponent(true)
    }
  }


  return (
    <div class=' fixed inset-0 z-40 w-full h-full flex items-center justify-center bg-black/40'>
      <div class='sm:w-[clamp(12rem,55vw,28rem)] p-5 rounded-lg shadow-lg bg-white'>
        <div class='flex justify-between mb-4 items-center'>
          <h1 class='font-semibold text-lg' >Edit Profile</h1>
          <button class='text-3xl cursor-pointer' onClick={() => dispatch(profileEditModel(false))}>&times;</button>
        </div>
        <form action="" class='space-y-3 flex flex-col'>
          <div class='flex gap-3 items-center ' >
            <div class='' ><img class='w-10 h-10 rounded-full object-cover' src={userinfo?.user?.profilePic} alt="" /></div>
            <input name='profilePic' onChange={handlechange} class='w-full text-sm border border-slate-300 p-2 rounded-sm file:border file:rounded-sm file:bg-slate-200 file:cursor-pointer file:p-1' type="file" />
          </div>
          <input name='name' onChange={handlechange} class='p-2 border rounded-sm border-slate-300 text-sm' type="text" placeholder='Name' value={user?.name} />
          <input name='email' onChange={handlechange} class='p-2 border rounded-sm border-slate-300 text-sm' type="text" placeholder='Email' value={user?.email} />
          {errorComponent && (<p className='text-red-500 p-2'>Profile Update Failed</p>)}
          <button onClick={handlesubmit} class='p-2 bg-blue-600 text-white rounded-sm cursor-pointer' >{ saveChangeloading?'Saving changes...':'Save changes'}</button>
        </form>
      </div>
    </div>
  )
}

export default ProfileEditModel