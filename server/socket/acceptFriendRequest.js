
import FriendRequest from "../models/friendRequest.js";
import OneToOneChat from "../models/oneToOneChat.js";
import getPendingFriendRequests from "../utils/getPendingFriendRequests.js";
import getAcceptedFriendRequests from "../utils/getAcceptedFriendRequests.js";
import getOneToOneChats from "../utils/getOneToOneChats.js";

const acceptFriendRequest = (io, socket) => {
    // send friend request
    socket.on("acceptFriendRequest", async ({ friendrequestId, sender, receiver }) => {
        try {
            const updatedRequest = await FriendRequest.findByIdAndUpdate(friendrequestId, { status: "accepted" }, { new: true })
            const pendingFriendRequests = await getPendingFriendRequests(receiver)
            io.to(receiver).emit("receiveFriendRequest", { pendingFriendRequests });
            const senderPendingFriendRequests = await getPendingFriendRequests(sender)
            io.to(sender).emit("receiveFriendRequest", { pendingFriendRequests: senderPendingFriendRequests});
            //  prevent duplicate chat
            const existingChat = await OneToOneChat.findOne({
                members: { $all: [sender, receiver] },
            }).lean();;

            if (!existingChat) {
                await OneToOneChat.create({
                    members: [sender, receiver],
                });
                const oneToOneChatsForReceiver = await getOneToOneChats(receiver)
                io.to(receiver).emit("OneToOneChats", oneToOneChatsForReceiver);
                const oneToOneChatsForSender = await getOneToOneChats(sender)
                io.to(sender).emit("OneToOneChats", oneToOneChatsForSender);
            }

            const acceptedFriendRequests = await getAcceptedFriendRequests(receiver)
            io.to(receiver).emit("receiveAcceptedFriendRequest", {acceptedFriendRequests });

            const senderAcceptedFriendRequests = await getAcceptedFriendRequests(sender)
            io.to(sender).emit("receiveAcceptedFriendRequest", {acceptedFriendRequests: senderAcceptedFriendRequests });



        } catch (err) {
            console.log("Error sending message:", err);
        }
    });

};

export default acceptFriendRequest;