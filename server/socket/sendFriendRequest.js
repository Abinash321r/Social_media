import postFriendRequest from "../utils/postFriendRequests.js";
import getPendingFriendRequests from "../utils/getPendingFriendRequests.js";

const sendFriendRequest = (io, socket) => {
// send friend request
socket.on("sendFriendRequest",  async ({sender, receiver}) => {
try {
    await postFriendRequest(sender,receiver);
    const pendingFriendRequests = await getPendingFriendRequests(receiver);
    console.log('emitting pending reuest to receiver')
    io.to(receiver).emit("receiveFriendRequest",  {pendingFriendRequests} );
} catch (err) {
    console.log("Error sending message:", err);
}
});

};

export default sendFriendRequest;