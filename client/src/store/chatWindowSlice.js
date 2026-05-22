import { createSlice } from '@reduxjs/toolkit'

const initialState = {
oneToOneChatMessages:null,
groupChatMessages:null
}

export const chatWindowSlice = createSlice({
  name: 'chatWindowSlice',
  initialState,
  reducers: {
 getOneToOneChatMessages:(state,action)=>{
    state.oneToOneChatMessages=action.payload;
 },
 getGroupChatMessages: (state,action) => {
    state.groupChatMessages =action.payload; 
 },
 updateOneToOneChatMessages:(state,action)=>{
    if (state.oneToOneChatMessages === null) {
    state.oneToOneChatMessages=[action.payload]
    return
  }
  const isSameChat = state.oneToOneChatMessages.every((item) =>
    item.chatId === action.payload.chatId
  )
  if (isSameChat) {
    state.oneToOneChatMessages.push(action.payload)
  }
  },
 updateGroupChatMessages:(state,action)=>{
    if (state.groupChatMessages === null) {
    state.groupChatMessages=[action.payload]
    return
  }
  const isSameChat = state.groupChatMessages.every((item) =>
    item.chatId === action.payload.chatId
  )
  if (isSameChat) {
    state.groupChatMessages.push(action.payload)
  }
 },
  updateOneToOneMessageSeen:(state, action) => {
   const {oneToOneChatId, oneToOneChatMsgId} = action.payload;
   const message =state.oneToOneChatMessages.find((item) =>
     item.chatId === oneToOneChatId &&item._id === oneToOneChatMsgId
     );
   if (message) {
     message.status = "seen";
   }
 },
 updateGroupMessageSeen:(state, action) => {
  const {groupChatId, groupChatMsgId} = action.payload;
  const message =state.groupChatMessages.find((item) =>
    item.chatId === groupChatId &&item._id === groupChatMsgId
    );
  if (message) {
    message.status = "seen";
  }
},
logoutChatWindow:()=>(initialState)
  },
})

export const {getOneToOneChatMessages,getGroupChatMessages,updateOneToOneChatMessages,updateGroupChatMessages,updateOneToOneMessageSeen,updateGroupMessageSeen,logoutChatWindow} = chatWindowSlice.actions

export default chatWindowSlice.reducer