import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const socketUrl = import.meta.env.VITE_SOCKET_URL;

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await fetch(`${socketUrl}/checkcookie`, { credentials: "include", });
  const data = await response.json();
  return data;
});

const initialState = {
  userinfo: {
    user: null,
    isAuthenticated: false
  },
  friendsinfo: null,
  pendingfriendRequestsinfo: null,
  groupChatsinfo: null,
  groupChatsPresence: {},
  oneToOneChatsinfo: null,
  oneToOneChatsPresence: {},
  loading: true,
  error: null,
}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.userinfo.user = action.payload.user;
    },
    updateOneToOneUnreadCount: (state, action) => {
      const { oneToOneChatId, unreadcount } = action.payload;
      const chat = state.oneToOneChatsinfo.find((item) => item._id === oneToOneChatId);
      if (chat) {
        chat.unread = [
          {
            count: unreadcount
          }
        ];
      }
    },
    updateGroupUnreadCount: (state, action) => {
      const { groupChatId, unreadcount } = action.payload;
      const chat = state.groupChatsinfo.find((item) => item._id === groupChatId);
      if (chat) {
        chat.unread = [
          {
            count: unreadcount
          }
        ];
      }
    },
    updateOneToOneChats: (state, action) => {
      state.oneToOneChatsinfo = action.payload;
    },
    updateGroupChats: (state, action) => {
      state.groupChatsinfo = action.payload;
    },
    updateOneToOneChatPresence: (state, action) => {
      const { userId, presence } = action.payload;
      state.oneToOneChatsinfo?.forEach((chat) => {
        // check if user belongs to chat
        const isMember = chat.members.some((member) =>
          (typeof member === 'object' ? member._id : member) === userId
        );
        if (isMember) {
          // create field if not exists
          if (!chat.memberPresence) {
            chat.memberPresence = {};
          }
          // update current user presence
          chat.memberPresence[userId] = presence;
          // make current logged-in user always online
          chat.memberPresence[state.userinfo?.user?._id] = "online";

          // check if all online
          const allOnline = chat.members.every(
            (member) => {
              const id = typeof member === 'object' ? member._id : member;
              return chat.memberPresence[id] === "online";
            }
          );
          // create/update chat presence
          state.oneToOneChatsPresence[chat?._id] = allOnline
            ? "online"
            : "offline";
        }
      });
    },
    updateGroupChatPresence: (state, action) => {
      const { userId, presence } = action.payload;
      state.groupChatsinfo?.forEach((chat) => {
        // check if user belongs to chat
        const isMember = chat.members.some((member) =>
          (typeof member === 'object' ? member._id : member) === userId
        );
        if (isMember) {
          // create field if not exists
          if (!chat.memberPresence) {
            chat.memberPresence = {};
          }
          // update current user presence
          chat.memberPresence[userId] = presence;
          // make current logged-in user always online
          chat.memberPresence[state.userinfo?.user?._id] = "online";

          // check if all online
          const allOnline = chat.members.every(
            (member) => {
              const id = typeof member === 'object' ? member._id : member;
              return chat.memberPresence[id] === "online";
            }
          );

          // create/update chat presence
          state.groupChatsPresence[chat?._id] = allOnline
            ? "online"
            : "offline";
        }
      });
    },
    updatePendingfriendRequestsinfo: (state, action) => {
      const { pendingFriendRequests } = action.payload
      if (pendingFriendRequests != undefined) {
        state.pendingfriendRequestsinfo = pendingFriendRequests
      }
    },
    updateAcceptedfriendRequestsinfo: (state, action) => {
      const { acceptedFriendRequests } = action.payload
      if (acceptedFriendRequests != undefined) {
        state.friendsinfo = acceptedFriendRequests
      }
    },
    logoutAuth:()=>initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled,
        (state, action) => {
          state.loading = false;
          if (action.payload?.message == "No Token") {
            state.userinfo.user = null;
            state.userinfo.isAuthenticated = null
          }
          else {
            state.userinfo.user = action.payload.user;
            state.userinfo.isAuthenticated = action.payload.isAuthenticated;
            state.friendsinfo = action.payload.friends;
            state.pendingfriendRequestsinfo = action.payload.pendingfriendRequests;
            state.groupChatsinfo = action.payload.groupChats;
            state.oneToOneChatsinfo = action.payload.oneToOneChats;
          }
        })
      .addCase(checkAuth.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
  },

})
export const { updateUserInfo, updateOneToOneUnreadCount, updateGroupUnreadCount, updateOneToOneChats, updateGroupChats, updateOneToOneChatPresence, updateGroupChatPresence, updatePendingfriendRequestsinfo, updateAcceptedfriendRequestsinfo, logoutAuth} = authSlice.actions

export default authSlice.reducer

