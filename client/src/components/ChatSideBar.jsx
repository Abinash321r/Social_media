import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createGroupModel, OneToOneChatOpen, GroupChatOpen} from '../store/modelOpeningSlice.js'
import { getOneToOneChatMessages, getGroupChatMessages,logoutChatWindow } from '../store/chatWindowSlice.js'
import socket from '../socket/socket.js'

function ChatSideBar() {
  const dispatch = useDispatch()
  const { userinfo, groupChatsinfo, oneToOneChatsinfo, oneToOneChatsPresence, groupChatsPresence } = useSelector((state) => state.auth)

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const [chatSelect, setChatSelect] = useState(null)

  const handleOneToOneChatClick = async (item, otherUser) => {
    socket.emit('joinOneToOneChat', item?._id)
    setChatSelect(item._id)
    dispatch(logoutChatWindow()) // clear all previos chat messages
    dispatch(OneToOneChatOpen({
      state: true,
      chatId: item?._id,
      avatar: otherUser?.profilePic,
      name: otherUser?.name,
      presence:oneToOneChatsPresence?.[item?._id], 
    }))


    try {
      const response = await fetch(`${socketUrl}/one_to_one_chat_messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ oneToOneChatId: item?._id })
        })
      if (response.ok) {
        const result = await response.json()
        console.log('result1:', result)
        dispatch(getOneToOneChatMessages(result?.data))
      }
    } catch (err) {
      console.log('error from chat sidebar')
    }

  }

  const handleGroupChatClick = async (item) => {
    socket.emit('joinGroupChat', item?._id)
    setChatSelect(item._id)
    dispatch(logoutChatWindow()) // clear all previos chat messages
    dispatch(GroupChatOpen({
      state: true,
      chatId: item?._id,
      avatar: item?.avatar,
      name: item?.name,
      presence:groupChatsPresence?.[item?._id],
    }))

    try {
      const response = await fetch(`${socketUrl}/group_chat_messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ groupChatId: item?._id })
        })
      if (response.ok) {
        const result = await response.json()
        console.log('result2:', result)
        dispatch(getGroupChatMessages(result?.data))
      }
    } catch (err) {
      console.log('error from chat sidebar')
    }


  }

  return (
    <>
      <div class='p-3 flex justify-between border-b border-b-slate-300 bg-white'>
        <h1 class='font-semibold text-lg'>Chats</h1>
        <button onClick={() => dispatch(createGroupModel(true))} class='px-3 py-1.5 bg-slate-800 rounded-md text-white text-xs cursor-pointer'>New group</button>
      </div>
      <div class='overflow-y-auto flex-1  scrollbar-thin scrollbar-thumb-slate-300 bg-white border-b border-b-slate-300'>
        {
          oneToOneChatsinfo?.length > 0 && (
            <>
              {
                oneToOneChatsinfo.map((item, index) => {
                  const otherUser = item.members.find(
                    member => member._id !== userinfo.user._id
                  );
                  return (
                    <>
                      <button onClick={() => handleOneToOneChatClick(item, otherUser)} class={`w-full p-4 cursor-pointer hover:bg-slate-50 flex gap-3 border-b border-slate-100 ${chatSelect === item._id ? 'bg-slate-100' : 'bg-white'}`} >
                        <div class='relative flex items-center'>
                          <img class='w-8 h-8 rounded-full object-cover' src={otherUser?.profilePic} alt="" />
                          {oneToOneChatsPresence?.[item?._id]==='online'&&<span class='bg-green-500 h-2.5 w-2.5 rounded-full absolute bottom-1.5 -right-0.5'></span>}
                        </div>
                        <div class='flex gap-3 justify-between flex-1 items-center '>
                          <div class='flex-1 flex flex-col items-start gap-1'>
                            <p class='truncate font-medium'>{otherUser?.name}</p>
                            <p class='truncate text-xs text-slate-500'>{item?.lastMessage?.text}</p>
                          </div>
                          <div>
                            {item?.unread?.[0]?.count > 0 && <p class='min-w-5 min-h-5 aspect-square bg-red-500 text-white rounded-full flex items-center justify-center p-1'>{item?.unread?.[0]?.count > 99 ? '99+' : item?.unread[0]?.count}</p>}
                          </div>
                        </div>
                      </button>
                    </>
                  )
                })
              }
            </>)
        }
        {
          groupChatsinfo?.length > 0 && (
            <>
              {
                groupChatsinfo.map((item, index) => {
                  return (
                    <>
                      <button onClick={() => handleGroupChatClick(item)} class={`w-full p-4 cursor-pointer hover:bg-slate-50 flex gap-3 border-b border-slate-100 ${chatSelect === item._id ? 'bg-slate-100' : 'bg-white'}`}>
                        <div class='relative flex items-center'>
                          <img class='w-8 h-8 rounded-full object-cover' src={item?.avatar} alt="" />
                          {groupChatsPresence?.[item?._id]==='online'&&<span class='bg-green-500 h-2.5 w-2.5 rounded-full absolute bottom-1.5 -right-0.5'></span>}
                        </div>
                        <div class='flex gap-3 justify-between flex-1 items-center min-w-0'>
                          <div class=' flex-1 flex flex-col text-left gap-1  min-w-0  '>
                            <p class='truncate font-medium'>{item?.name}</p>
                            <p class='truncate text-xs text-slate-500'>{item?.lastMessage?.text}</p>
                          </div>
                          <div>
                            {item?.unread?.[0]?.count>0 && <p class='min-w-5 min-h-5 aspect-square bg-red-500 text-white rounded-full flex items-center justify-center p-1'>{item?.unread?.[0]?.count > 99 ? '99+' : item?.unread?.[0]?.count}</p>}
                          </div>
                        </div>
                      </button>
                    </>
                  )
                })
              }
            </>)
        }
        {
          (oneToOneChatsinfo?.length===0 && groupChatsinfo?.length===0) && (<p class=' p-4 text-xs text-slate-500'>No chats available. </p>)
        }

      </div>
    </>
  )
}

export default ChatSideBar