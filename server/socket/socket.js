import setupSocket from "./setupSocket.js";
import disconnectSocket from "./disconnectSocket.js";

import joinOneToOneChat from "./joinOneToOneChat.js";
import sendOneToOneChatMessage from "./sendOneToOneChatMessage.js";
import seenOneToOneMessages from "./seenOneToOneMessages.js";

import joinGroupChat from "./joinGroupChat.js";
import sendGroupChatMessage from "./sendGroupChatMessage.js";
import seenGroupMessages from "./seenGroupMessages.js";

import sendFriendRequest from "./sendFriendRequest.js";
import acceptFriendRequest from "./acceptFriendRequest.js";
import deleteFriendRequest from "./deleteFriendRequest.js";
const socketHandler = (io) => {

  io.on("connection", (socket) => {
   console.log("User connected:", socket.id);
    setupSocket(io, socket);

    joinOneToOneChat(socket);

    joinGroupChat(socket);

    sendFriendRequest(io, socket);

    acceptFriendRequest(io, socket);
    
    deleteFriendRequest(io,socket);
    
    sendOneToOneChatMessage(io, socket);

    seenOneToOneMessages(io, socket);

    sendGroupChatMessage(io, socket);

    seenGroupMessages(io, socket);

    disconnectSocket(io, socket);

    });

};

export default socketHandler;