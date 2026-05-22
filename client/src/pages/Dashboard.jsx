
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProfileEditModel from '../components/ProfileEditModel'
import ViewProfileModel from '../components/ViewProfileModel'
import FriendPanel from '../components/FriendPanel'
import ChatSideBar from '../components/ChatSideBar'
import OneToOneChatWindow from '../components/OneToOneChatWindow'
import GroupChatWindow from '../components/GroupChatWindow'
import CreateGroupModel from '../components/CreateGroupModel'
import socket from '../socket/socket'
import { updateOneToOneUnreadCount,updateGroupUnreadCount, updateOneToOneChats, updateGroupChats, updateOneToOneChatPresence, updateGroupChatPresence,updatePendingfriendRequestsinfo, updateAcceptedfriendRequestsinfo} from '../store/authSlice'
import { updateOneToOneChatMessages, updateGroupChatMessages, updateOneToOneMessageSeen, updateGroupMessageSeen} from '../store/chatWindowSlice'
//import handleOneToOneChatMessage from '../socket/handleOneToOneChatMessage'

function Dashboard() {
  const dispatch = useDispatch()

  const { userinfo, pendingfriendRequestsinfo, friendsinfo, groupChatsinfo, oneToOneChatsinfo } = useSelector((state) => state.auth)
  const { isProfileEditModelOpen, isViewProfileModelOpen, isCreateGroupModelOpen, isOneToOneChatOpen, isGroupChatOpen, isChatOpen } = useSelector((state) => state.modelopen)


  useEffect(()=>{
    console.log(' changed userinfo and friend info',userinfo,friendsinfo)
    const friends = friendsinfo?.map((item) => item?._id)
    socket.emit("setup", { userId: userinfo?.user?._id, friendlist: friends})
  },[userinfo, friendsinfo])

  useEffect(() => {
    console.log(userinfo, pendingfriendRequestsinfo, oneToOneChatsinfo, groupChatsinfo, friendsinfo)

    socket.connect();

    socket.on("receiveOneToOneChatMessage", (message) => {
      dispatch(updateOneToOneChatMessages(message))
    })
    socket.on("receiveGroupChatMessage", (message) => {
      dispatch(updateGroupChatMessages(message))
    })

    socket.on("OneToOneChats", (message) => {
      console.log('oneToOneChats + unread count', message)
      dispatch(updateOneToOneChats(message))
    })
    socket.on("GroupChats", (message) => {
      console.log('GroupChats + unread count', message)
      dispatch(updateGroupChats(message))
    })

    socket.on("unreadCountOneToOneChat", (message) => {
      console.log('one to one unread count', message)
      dispatch(updateOneToOneUnreadCount(message))
    })
    socket.on("unreadCountGroupChat", (message) => { 
      console.log('one to one unread count', message)
      dispatch(updateGroupUnreadCount(message))
    })

    socket.on("messagesSeenOneToOneChat", (message) => {
      console.log('onte to one chat seen by', message)
      dispatch(updateOneToOneMessageSeen(message))
    })
    socket.on("messagesSeenGroupChat", (message) => {
      console.log('Group chat seen by', message)
      dispatch(updateGroupMessageSeen(message))
    })
    socket.on("presenceUpdate", (message) => {
      console.log('presence update messages', message)
      dispatch(updateOneToOneChatPresence(message))
      dispatch(updateGroupChatPresence(message))
    })
    socket.on("receiveFriendRequest",(message)=>{
      console.log("friend request created",message)
      dispatch(updatePendingfriendRequestsinfo(message))
      const {pendingFriendRequests}=message
    })

    socket.on("receiveAcceptedFriendRequest",(message)=>{
     console.log("friend request accepted",message)
     dispatch(updateAcceptedfriendRequestsinfo(message))
    })

    return () => {
      socket.off("receiveOneToOneChatMessage");
      socket.off("receiveGroupChatMessage");

      socket.off("OneToOneChats");
      socket.off("GroupChats");

      socket.off("unreadCountOneToOneChat");
      socket.off("unreadCountGroupChat");

      socket.off("messagesSeenOneToOneChat");
      socket.off("messagesSeenGroupChat");

      socket.off("presenceUpdate");
      socket.off("receiveFriendRequest");
      socket.off("receiveAcceptedFriendRequest");

      socket.disconnect();
    };

  }, [])

  return (
    <div class='w-full h-full flex flex-col'>
      <Navbar />
      <div class='flex-1 flex flex-row pb-2 overflow-hidden bg-slate-100 '>
        <div class={isChatOpen ? 'hidden sm:flex sm:w-[20rem] md:w-[24rem]' : 'flex w-full sm:w-[20rem] md:w-[24rem]'}>
          <div class={'w-full h-full border-r border-slate-300 flex flex-col'} >
            <FriendPanel />
            <ChatSideBar />
          </div>
        </div>
        <div class={isChatOpen ? 'flex w-full sm:flex-1' : 'hidden sm:flex sm:flex-1'}>
          {isOneToOneChatOpen?.state ? (<div class='flex-1'><OneToOneChatWindow  chatId={isOneToOneChatOpen?.chatId} avatar={isOneToOneChatOpen?.avatar} name={isOneToOneChatOpen?.name} presence={isOneToOneChatOpen?.presence }  /></div>)
            : isGroupChatOpen?.state ? (<div class='flex-1'><GroupChatWindow  chatId={isGroupChatOpen?.chatId} avatar={isGroupChatOpen?.avatar} name={isGroupChatOpen?.name} presence={isGroupChatOpen?.presence} /></div>)
              : (<div class='p-6 bg-slate-100 w-full h-full'><p>Select a chat to start messaging.</p></div>)}
        </div>
      </div>
      {isProfileEditModelOpen && (<ProfileEditModel />)}
      {isViewProfileModelOpen && (<ViewProfileModel />)}
      {isCreateGroupModelOpen && (<CreateGroupModel />)}
    </div>
  )
}

export default Dashboard