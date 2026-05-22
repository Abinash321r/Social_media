import { createSlice } from '@reduxjs/toolkit'

const initialState = {
isProfileEditModelOpen:false,
isViewProfileModelOpen:false,
isCreateGroupModelOpen:false,
isOneToOneChatOpen:null,
isGroupChatOpen:null,
isChatOpen:false
}

export const modelOpeningSlice = createSlice({
  name: 'modelOpeningSlice',
  initialState,
  reducers: {
 profileEditModel:(state,action)=>{
    state.isProfileEditModelOpen=action.payload;
 },
 viewProfileModel: (state,action) => {
      state.isViewProfileModelOpen =action.payload; 
    },
 createGroupModel:(state,action)=>{
    state.isCreateGroupModelOpen=action.payload;
 },
 OneToOneChatOpen:(state,action)=>{
    state.isOneToOneChatOpen=action.payload;
    state.isChatOpen=true
    state.isGroupChatOpen = null;
 },
 GroupChatOpen:(state,action)=>{
   state.isGroupChatOpen=action.payload;
   state.isChatOpen=true
    state.isOneToOneChatOpen = null;
   
 },
 ChatOpen:((state,action)=>{
   state.isChatOpen=action.payload
 }),
logoutModelOpening:()=>initialState

  },
})

export const {profileEditModel, viewProfileModel, createGroupModel,OneToOneChatOpen, GroupChatOpen, ChatOpen, logoutModelOpening} = modelOpeningSlice.actions

export default modelOpeningSlice.reducer