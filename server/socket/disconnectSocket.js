const disconnectSocket = (io, socket) => {
  //  Disconnect
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    try {

      const sockets = await io.in(socket.userId).fetchSockets();

      // user fully offline
      if (sockets.length === 0) {
        io.to(socket.friendlist).emit("presenceUpdate",
          {
            userId: socket.userId,
            presence: "offline"
          }
        );
      }

    } catch (err) {
      console.log("Disconnect error:", err);
    }

  });
};

export default disconnectSocket;