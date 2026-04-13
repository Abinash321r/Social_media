import GroupChat from '../models/groupChat.js'

const getGroupChatData = async (req, res) => {
 try {
    const { name, members, admin } = req.body;

    //  Basic validation
    if (!name || !members || !admin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Ensure members is array
    if (!Array.isArray(members)) {
      return res.status(400).json({ message: "Members must be an array" });
    }

    //  Create group chat
    const savedGroup = await GroupChat.create({
      name,
      members,
      admin,
    });

   

    res.status(201).json({
      message: "Group chat created successfully",
      data: savedGroup,
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default getGroupChatData;