// sockets/group/seenGroupMessages.js

import GroupChat from "../models/groupChat.js";
import GroupChatMsg from "../models/groupChatMsg.js"

import getUnreadCountGroupChat from '../utils/getUnreadCountGroupChat.js'

const seenGroupMessages = (io, socket) => {

socket.on("seenGroupMessages",async ({groupChatId, groupChatMsgId, userId}) => {
try {

    // add user uniquely
    await GroupChatMsg.updateMany(
    {
        _id: groupChatMsgId,
        sender: { $ne: userId }
    },
    {
        $addToSet: {
        seenBy: userId
        }
    }
    );

    // get chat members
    const chat = await GroupChat.findById(groupChatId).lean();

    // mark fully seen
    const result = await GroupChatMsg.updateMany(
    {
        _id: groupChatMsgId,

        $expr: {
        $eq: [
            {
            $size: "$seenBy"
            },
            chat.members.length
        ]
        }
    },
    {
        status: "seen"
    }
    );

    const unreadcount = await getUnreadCountGroupChat(groupChatId, userId);
    io.to(userId).emit("unreadCountGroupChat", {groupChatId, unreadcount})

    if (result.modifiedCount > 0) {
    io.to(groupChatId).emit("messagesSeenGroupChat", {groupChatId, groupChatMsgId, userId})
    }

}
catch (err) {

    console.log("Seen error:",err);
}

});


};

export default seenGroupMessages;