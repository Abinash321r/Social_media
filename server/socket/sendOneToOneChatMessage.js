import OneToOneChatMsg from "../models/oneToOneChatMsg.js";
import getUnreadCountOneToOneChat from "../utils/getUnreadCountOneToOneChat.js";
import getOneToOneChats from '../utils/getOneToOneChats.js'
import OneToOneChat from "../models/oneToOneChat.js";

const sendOneToOneChatMessage = (io, socket) => {

//  sendOneToOneChatMessage
socket.on("sendOneToOneChatMessage",  async ({ oneToOneChatId, sender, text }) => {
try {
    console.log('one to one chat message',oneToOneChatId, sender, text )
    const newMessage =
    await OneToOneChatMsg.create({
        chatId: oneToOneChatId,
        sender,
        text,
        seenBy: [sender] // sender already saw own msg
    });
  const populatedMessage = await OneToOneChatMsg.findById(newMessage._id).populate("sender", "-password");
    // EMIT or Deliver SAVED MESSAGE
    io.to(oneToOneChatId).emit("receiveOneToOneChatMessage", populatedMessage);
    //EMIT unread messages
    const chat =await OneToOneChat.findById(oneToOneChatId);
    chat.members.map(async (memberId) => {
    const oneToOneChats= await getOneToOneChats(memberId)
    io.to(memberId.toString()).emit("OneToOneChats",oneToOneChats);
});
} catch (err) {
    console.log("Error sending message:", err);
}
});


};

export default sendOneToOneChatMessage;