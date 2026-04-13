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

const router = express.Router();

router.post('/signupdata', upload.single("profilePic"),getSignUpData);
router.post('/logindata', getLoginData);
router.get('/checkcookie',isAuthenticated,getCookieStatus);
router.post('/logout', getLogoutStatus);

router.post('/friend_request', getFriendRequestData);
router.post('/friend_request_status', getFriendRequestStatus);

router.post('/group_chat', getGroupChatData);

router.put('/conversation_seen', updateConversationStatus);

router.get('/',(req,res)=>{
   console.log(req.cookies.usertoken)
  res.end('<h1>hello from server</h1>')
})




export default router;