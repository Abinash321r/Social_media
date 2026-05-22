import { useDispatch } from "react-redux"
import {updateOneToOneChatMessages} from '../store/chatWindowSlice'

//const dispatch=useDispatch()

const  handleOneToOneChatMessage = (message)=>{
console.log('onetoone messgae from socket',message)
//dispatch(updateOneToOneChatMessages(message))
}

export default  handleOneToOneChatMessage 