import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { profileEditModel,viewProfileModel} from '../store/modelOpeningSlice'

function ProfileMenu() {
    const dispatch=useDispatch()
  return (
   <div class='absolute top-12 right-0 shadow-lg p-2 rounded-md w-[clamp(8rem,10rem,12rem)] bg-white '>
      <button onClick={()=>dispatch(viewProfileModel(true))} class='w-full px-3 py-2 hover:bg-slate-100 cursor-pointer rounded-md'><p>View profile</p></button>
      <button onClick={()=>dispatch(profileEditModel(true))} class='w-full px-3 py-2 hover:bg-slate-100 cursor-pointer rounded-md'><p>Edit profile</p></button>
    </div>
  )
}

export default ProfileMenu