import Conversation from "../models/conversationSchema.js";

const socketHandler = (io) => {

   io.on("connection", (socket) => {
     console.log("User connected:", socket.id);

     //  Join one to one Chat 
     socket.on("joinOneToOneChat", (oneToOneChatId) => {
       socket.join(oneToOneChatId);
       console.log(`Joined chat: ${oneToOneChatId}`);
     });

    //  join groupchat room
     socket.on("joinGroupChat", (groupChatId) => {
       socket.join(groupChatId);
       console.log(`Joined chat: ${groupChatId}`);
     });

     //  sendOneToOneChatMessage
     socket.on("sendOneToOneChatMessage",  async ({ oneToOneChatId, sender, text }) => {
       try {
            //SAVE TO DB
            const newMessage = await Conversation.create({
              chatType: "one-to-one",
              chatId: oneToOneChatId,
              chatTypeRef: "OneToOneChat",
              sender,
              text,
            });
            // EMIT or Deliver SAVED MESSAGE
            io.to(oneToOneChatId).emit("receiveOneToOneChatMessage", newMessage);
        } catch (err) {
          console.log("Error sending message:", err);
        }
     });

     //  sendGroupChatMessage 
     socket.on("sendGroupChatMessage", async ({ groupChatId, sender, text }) => {
        try {
          // SAVE TO DB
          const newMessage = await Conversation.create({
            chatType: "group",
            chatId: groupChatId,
            chatTypeRef: "GroupChat",
            sender,
            text,
          });
          //  EMIT or Deliver  SAVED MESSAGE
          io.to(groupChatId).emit("receiveGroupChatMessage", newMessage);
        } catch (err) {
          console.log("Error sending message:", err);
        }
     });

      //  update conversaion status 
     socket.on("messageDelivered", async (conversationId) => {
       try {
         await Conversation.findByIdAndUpdate(conversationId, {
           status: "delivered",
         });
        } catch (err) {
         console.log("Delivery update error:", err);
       }
     });
   
     //  Disconnect
     socket.on("disconnect", () => {
       console.log("User disconnected:", socket.id);
     });
    });

};

export default socketHandler;