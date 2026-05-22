// sockets/oneToOne/seenOneToOneMessages.js

import OneToOneChat from "../models/oneToOneChat.js";
import OneToOneChatMsg from "../models/oneToOneChatMsg.js";
import getUnreadCountOneToOneChat from '../utils/getUnreadCountOneToOneChat.js'

const seenOneToOneMessages = (io, socket) => {

socket.on("seenOneToOneMessages",async ({oneToOneChatId, oneToOneChatMsgId, userId}) => {
try {

    // add user uniquely
    await OneToOneChatMsg.updateMany(
    {
        _id: oneToOneChatMsgId,
        sender: { $ne: userId }
    },
    {
        $addToSet: {
        seenBy: userId
        }
    }
    );

    // get chat members
    const chat = await OneToOneChat.findById(oneToOneChatId).lean();

    // mark fully seen
    const result = await OneToOneChatMsg.updateMany(
    {
        _id: oneToOneChatMsgId,

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

    const unreadcount = await getUnreadCountOneToOneChat(oneToOneChatId, userId);
    io.to(userId).emit("unreadCountOneToOneChat", {oneToOneChatId, unreadcount})

    if (result.modifiedCount > 0) {
    io.to(oneToOneChatId).emit("messagesSeenOneToOneChat", {oneToOneChatId, oneToOneChatMsgId, userId})
    }

}
    catch (err) {

    console.log(
    "Seen error:",
    err
    );

}

}
);

};

export default seenOneToOneMessages;