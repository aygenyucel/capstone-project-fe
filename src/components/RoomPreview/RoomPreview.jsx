/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "react-bootstrap";
import "./RoomPreview.css"
import { useNavigate } from 'react-router-dom';
import { useEffect} from "react";
import {  useDispatch, useSelector } from "react-redux";
const RoomPreview = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roomData = props.roomData;
    const user = useSelector(state => state.profileReducer.data)
    const users = roomData.users;

    const joinTheRoom = () => {
        console.log("join the room button triggered!")
        navigate(`/chatroom/${roomData.endpoint}`, {state: {user: user, roomID: roomData._id}})
        // dispatch(addUserToRoomAction(user._id, roomData.endpoint, roomData._id))
        // .then((action) => dispatch(action))
        // .then(navigate(`/chatroom/${roomData.endpoint}`, {state: {user: user}}))
        // .catch(err => console.log(err))
        
    }
    useEffect(() => {
        console.log("roomData users", roomData)
    }, [])


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
                    <h1>users in the room</h1>
                    {users?.map(user =>  <div>{user}</div>)}
                </div>
                
                <Button onClick={joinTheRoom}>Join the room</Button>
            </div>)
}

export default RoomPreview;