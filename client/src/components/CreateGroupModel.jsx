import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {createGroupModel} from '../store/modelOpeningSlice'
import { useState } from 'react'

function CreateGroupModel() {
    const {userinfo, friendsinfo}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const [groupChatData,setGroupChatData]=useState({ name:null, members:[userinfo.user._id], admin:userinfo.user._id, avatar:null})
    const [createGroupLoading,setCreateGroupLoading]=useState(false)
    const [errorComponent,SetErrorComponent]=useState(false);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    const handleCheckboxChange = (id) => {
    setGroupChatData((prev) => (
        {...prev, members: prev.members.includes(id)
        ? prev.members.filter((item) => item !== id)
        : [...prev.members, id]
    }));

    };

    const handleGroupNameChange=(e)=>{
        const { name, value, files, type } = e.target;
        setGroupChatData({...groupChatData, [name]: type == 'file' ? files[0] : value})
    }
    const handlesubmit =async(e)=>{
        e.preventDefault()
        setCreateGroupLoading(true)

        if(!groupChatData?.name||groupChatData?.members?.length<=1)
        {
            SetErrorComponent(true)
            return;
        }
        const data = new FormData();
        data.append("name", groupChatData?.name);
        data.append("members", JSON.stringify(groupChatData.members));
        data.append("admin", groupChatData?.admin);
        data.append("avatar", groupChatData?.avatar);
        try{

        const response = await fetch(`${socketUrl}/group_chat`,
            {
                method:"POST",
                credentials: "include",
                body: data,
            })

        setCreateGroupLoading(false)
        if(response.ok){
            const result=await response.json()
            console.log('from groupchat',result)
            SetErrorComponent(false)
        }
        else{
            SetErrorComponent(true)
        }
    }catch(err){
        setCreateGroupLoading(false)
        SetErrorComponent(true)
    }
    }
  return (
        <div class=' fixed inset-0 z-40 w-full h-full flex items-center justify-center bg-black/40'>
      <div class='sm:w-[clamp(12rem,55vw,28rem)] rounded-lg shadow-lg bg-white'>
      <div class='px-4 py-3 flex flex-col border-b border-slate-300'>
        <h1 class='text-lg font-semibold'>New Group Chat</h1>
        <p class='text-xs text-slate-500'> Pick a name and add friends who accepted your requests.</p>
      </div>
      <form action="" class=''>
        <div class='p-4 flex flex-col space-y-3'>
        <div class='flex flex-col gap-2'>
          <label class='font-medium' >Group name </label>
          <input onChange={(e)=>handleGroupNameChange(e)} name='name' class=' px-3 py-2 text-sm border border-slate-300 rounded-lg' type="text" placeholder='e.g. Weekend plans'/>
           <input onChange={(e) => handleGroupNameChange(e)} name='avatar' type="file" className='w-full  border border-slate-300 rounded-sm p-2 file:border file:p-1 file:border-slate-400 file:rounded-sm file:cursor-pointer file:bg-gray-200' />
        </div>
        <p class='text-xs font-medium '>MEMBERS</p>
        <div class='p-2 max-h-32 border rounded-lg border-slate-300 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300'>
            {friendsinfo?(<>
            {
            friendsinfo.map((item,index)=>{
            return(
            <>
            <div class='flex px-2 py-1.5 gap-2 items-center'>
                <input onChange={()=>handleCheckboxChange(item._id)} class='h-full border border-slate-300 cursor-pointer' type="checkbox" name="" id="" />
                <p class='text-sm'>{item.name}</p>
                <p class='text-xs text-slate-500'>{item.email}</p>
            </div>
            </>
            )
            })
            }
            </>):
            (<p class='text-xs text-slate-500'>Friendlist Empty</p>)

            }
       </div>
       {errorComponent&&(<p class='text-red-600 text-sm'>Failed to create Group.</p>)}
       </div>
       <div class='flex justify-end border-t border-slate-300 px-4 py-3'>
        <div class='flex gap-2'>
            <button onClick={()=>dispatch(createGroupModel(false))} class='px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium cursor-pointer'>Cancel</button>
            <button onClick={(e)=>handlesubmit(e)} class='w-36 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer'>{createGroupLoading?'Creating group...':'Create Group'}</button>
        </div>
       </div>
      </form>
      </div>
      </div>
  )
}

export default CreateGroupModel