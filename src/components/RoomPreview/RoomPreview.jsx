import { Button } from "react-bootstrap";
import "./RoomPreview.css"
import { useNavigate } from 'react-router-dom';
import { useEffect} from "react";
import {  useDispatch, useSelector } from "react-redux";
import { addUserToRoomAction } from "../../redux/actions";
const RoomPreview = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roomData = props.roomData;
    const user = useSelector(state => state.profileReducer.data)

    
    const addUserToRoom = () => {
        dispatch(addUserToRoomAction(user._id, roomData.endpoint))
    }
    
    
    const joinTheRoom = () => {
        console.log("join the room button triggered!")
        navigate(`/chatroom/${roomData.endpoint}`,  {state: {user: user}})
        // addUserToRoom();
    }

    return (<div className="d-flex flex-column room-preview-div">
        <div className="d-flex">
                <div>room id: {roomData._id}</div>
                </div>
                <div className="d-flex">
                    <div>room capacity: {roomData.capacity}</div>
                </div>
                <div className="d-flex">
                    <div>Language: {roomData.language}</div>
                </div>
                <div className="d-flex">
                    <div>level: {roomData.level}</div>
                </div>
                <div className="d-flex">
                    <div>creator: {roomData.creator}</div>
                </div>
                <div>
                   current users in the room : 
        
                </div>
                <Button onClick={joinTheRoom}>Join the room</Button>
            </div>)
}

export default RoomPreview;