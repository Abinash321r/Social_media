import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'
import socket from '../socket/socket'
import { ChatOpen } from '../store/modelOpeningSlice'

function GroupChatWindow({ chatId, avatar, name, presence }) {
  const { groupChatMessages } = useSelector((state) => state.chatWindow)
  const { isChatOpen } = useSelector((state) => state.modelopen)
  const { userinfo, groupChatsPresence, groupChatsinfo} = useSelector((state) => state.auth)
  const [text, setText] = useState(null)
  const observer = useRef(null);
  const chatRef = useRef(null);
  const dispatch = useDispatch()

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const handlechange = (e) => {
    setText(e.target.value)
  }

  const handleclick = (e) => {
    e.preventDefault()
    setText('')
    socket.emit("sendGroupChatMessage", { groupChatId: chatId, sender: userinfo?.user?._id, text: text })
  }

  useEffect(() => {
    console.log("called from group chat window", groupChatMessages, chatId, avatar, name)
    const div = chatRef.current;
    if (!div) return;

    if (isChatOpen) {
    const chat = groupChatsinfo.find((item) => item._id === chatId)
    const unread = chat?.unread?.[0]?.count
      if(unread){
      const otherUserMessages = groupChatMessages.filter((msg) => msg.sender?._id !== userinfo?.user?._id)
      // first unseen message
      const firstUnseen = otherUserMessages?.[otherUserMessages?.length-unread]
      // scroll to that message
      if (firstUnseen) {
        const el = document.querySelector(
          `[data-msgid="${firstUnseen._id}"]`
        );

        el?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
      } else {
        // if all seen -> scroll bottom
        scrollToBottom();
      }
    }

  }, [groupChatMessages?.length])


  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const seenby = JSON.parse(entry.target.dataset.seenby)
            const msgId = entry.target.dataset.msgid
            if (!seenby.includes(userinfo?.user?._id)) {
              console.log('user seenby fiirst time and msgId', seenby, msgId)
              socket.emit('seenGroupMessages', { groupChatId: chatId, groupChatMsgId: msgId, userId: userinfo?.user?._id })
            }
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    return () => {
      observer.current.disconnect();
    };
  }, [chatId]);


  return (
    <div class='w-full h-full flex flex-col'>
      <div class='p-3 flex flex-row gap-3 border-b border-slate-300 bg-white'>
        <button  onClick={()=>dispatch(ChatOpen(false))} class='sm:hidden  p-1 text-2xl rounded-lg hover:bg-slate-100 cursor-pointer'>&larr;</button>
        <div class='relative flex items-center '>
          <img class='w-8 h-8 rounded-full object-cover' src={avatar} alt="" />
          {groupChatsPresence?.[chatId]==='online'  && <span class='bg-green-500 h-2.5 w-2.5 rounded-full absolute bottom-1.5 -right-0.5'></span>}
        </div>
        <div>
          <p class='font-medium' >{name}</p>
          <p class='text-xs text-slate-500'>{groupChatsPresence?.[chatId]==='online' ?'online':'offline'}</p>
        </div>
      </div>
      {groupChatMessages ?
        <div ref={chatRef} class='bg-slate-100 flex-1 p-4 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300'>
          {
            groupChatMessages.map((item, index) => {
              console.log('userinfo from group chat window', userinfo)
              return (
                (userinfo?.user?._id === item?.sender?._id) ? (
                  <div class='flex w-full justify-end'>
                    <div class='px-3 py-2 max-w-[min(78%,24rem)] sm:max-w-[min(50%,22rem)]  bg-blue-600 rounded-2xl rounded-br-sm text-white'>
                      <p class='whitespace-pre-wrap text-sm'>{item?.text}</p>
                      <p class='text-xs mt-1 uppercase text-right text-slate-200'>{item?.status}</p>
                    </div>
                  </div>) : (
                  <div class='flex w-full  justify-start gap-2'>
                    <div><img class='w-8 h-8 rounded-full object-cover' src={item?.sender?.profilePic} alt="" /> </div>
                    <div data-msgid={item?._id} data-seenby={JSON.stringify(item?.seenBy)} ref={(el) => { if (el) { observer?.current?.observe(el) } }} class='px-3 py-2 max-w-[min(78%,24rem)] sm:max-w-[min(50%,22rem)] bg-white rounded-2xl rounded-bl-sm text-slate-800'>
                      <p class='text-xs mt-1 font-medium text-slate-500'>{item?.sender?.name}</p>
                      <p class='whitespace-pre-wrap text-sm'>{item?.text}</p>
                    </div>
                  </div>)
              )
            })
          }
        </div>
        : <div class='flex-1'><LoadingSpinner /></div>}

      <form action="" class='p-4 bg-white border-t border-b border-t-slate-300 border-b-slate-300 flex gap-3'>
        <input value={text} onChange={(e) => handlechange(e)} class='px-3 py-2 rounded-lg border border-slate-400 flex-1 text-sm' type="text" placeholder='Type a message' />
        <button onClick={(e) => handleclick(e)} class='px-4 py-2 bg-blue-600 text-white font-medium rounded-lg cursor-pointer'>Send</button>
      </form>
    </div>
  )
}

export default GroupChatWindow

