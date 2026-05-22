
import FriendRequest from "../models/friendRequest.js";
import OneToOneChat from "../models/oneToOneChat.js";
import getPendingFriendRequests from "../utils/getPendingFriendRequests.js";
import getOneToOneChats from "../utils/getOneToOneChats.js";

const deleteFriendRequest = (io, socket) => {
// send friend request
socket.on("deleteFriendRequest",  async ({friendrequestId,sender, receiver}) => {
try {
    const updatedRequest = await FriendRequest.findByIdAndDelete(friendrequestId)
    const pendingFriendRequests = await getPendingFriendRequests(receiver);
    io.to(receiver).emit("receiveFriendRequest",  {pendingFriendRequests} );
} catch (err) {
    console.log("Error sending message:", err);
}
});

};
export default deleteFriendRequest;