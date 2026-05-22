const joinOneToOneChat = (socket) => {

//  Join one to one Chat 
socket.on("joinOneToOneChat", (oneToOneChatId) => {
socket.join(oneToOneChatId);
console.log(`Joined chat: ${oneToOneChatId}`);
});

};

export default joinOneToOneChat;