import express from 'express';
import getSignUpData from '../Controllers/userSignUp.js';
import getLoginData from '../Controllers/userLogin.js';
import upload from "../config/cloudinary.js"
import getCookieStatus from '../Controllers/userCookie.js';
import getLogoutStatus from '../Controllers/userLogout.js';
import {isAuthenticated} from '../Middlewares/Authentication.js'
import getFriendRequestData from '../Controllers/friendRequest.js'
import getFriendRequestStatus from '../Controllers/friendRequestStatus.js'
import getGroupChatData from '../Controllers/groupChat.js'
import updateConversationStatus from '../Controllers/conversationSeen.js'
import searchUsers from '../Controllers/searchUser.js'
import userProfileUpdate from '../Controllers/userProfileUpdate.js'
import oneToOneChatMessages from '../Controllers/oneToOneChatMessages.js';
import groupChatMessages from '../Controllers/groupChatMessages.js';

const router = express.Router();

router.get('/checkcookie',isAuthenticated,getCookieStatus);
router.get('/search_user/:keyword', searchUsers);


router.post('/one_to_one_chat_messages', oneToOneChatMessages);
router.post('/group_chat_messages', groupChatMessages);
router.post('/signupdata', upload.single("profilePic"),getSignUpData);
router.post('/logindata', getLoginData);
router.post('/logout', getLogoutStatus);
router.post('/group_chat', isAuthenticated, upload.single("avatar"), getGroupChatData);
//router.post('/friend_request', getFriendRequestData);


router.put('/friend_request_status', getFriendRequestStatus);
router.put('/update_profile', isAuthenticated, upload.single("profilePic"), userProfileUpdate);
//router.put('/conversation_seen', updateConversationStatus);

router.get('/',(req,res)=>{
   console.log(req.cookies.usertoken)
  res.end('<h1>hello from server</h1>')
})

// a lightweight health endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});



export default router;
