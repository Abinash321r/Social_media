const joinGroupChat = (socket) => {
//  join groupchat room
socket.on("joinGroupChat", (groupChatId) => {
socket.join(groupChatId);
console.log(`Joined chat: ${groupChatId}`);
});

};

export default joinGroupChat;