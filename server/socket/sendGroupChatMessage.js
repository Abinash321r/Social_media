import GroupChatMsg from "../models/groupChatMsg.js";
import getUnreadCountGroupChat from '../utils/getUnreadCountGroupChat.js'
import getGroupChats from "../utils/getGroupChats.js";
import GroupChat from "../models/groupChat.js";

const sendGroupChatMessage = (io, socket) => {

//  sendGroupChatMessage 
socket.on("sendGroupChatMessage",  async ({ groupChatId, sender, text }) => {
try {
    const newMessage =
    await GroupChatMsg.create({
        chatId: groupChatId,
        sender,
        text,
        seenBy: [sender] // sender already saw own msg
    });
    const populatedMessage = await GroupChatMsg.findById(newMessage._id).populate("sender", "-password");

    // EMIT or Deliver SAVED MESSAGE
    io.to(groupChatId).emit("receiveGroupChatMessage",populatedMessage );
   //EMIT unread messages
    const chat =await GroupChat.findById(groupChatId);
    chat.members.map(async (memberId) => {
    const groupChats= await getGroupChats(memberId)
    io.to(memberId.toString()).emit("GroupChats",groupChats);
});   



} catch (err) {
    console.log("Error sending message:", err);
}
});
};

export default sendGroupChatMessage;