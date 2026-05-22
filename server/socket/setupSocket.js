const setupSocket = (io, socket) => {
  //  Join  individual user room
  socket.on("setup", async ({ userId, friendlist }) => {

    try {
      console.log('called from setup')
      socket.userId = userId;
      socket.friendlist = friendlist;
      socket.join(userId);
      const usersockets = await io.in(userId).fetchSockets();

      // first active socket send presence to all friend
      if (usersockets.length === 1) {
        if (friendlist?.length > 0) {
          for (const friendId of friendlist) {
            io.to(friendId).emit("presenceUpdate", { userId, presence: "online" });
            const friendsocket = await io.in(friendId).fetchSockets()
            if (friendsocket?.length > 0) {
              io.to(userId).emit("presenceUpdate", { userId: friendId, presence: "online" })
            }
          }
        }

      }
      // first active socket send presence from all friend to user

      console.log(
        `User joined room ${userId} (online)`
      );

    } catch (err) {
      console.log("Setup error:", err);
    }

  }
  );

};

export default setupSocket;