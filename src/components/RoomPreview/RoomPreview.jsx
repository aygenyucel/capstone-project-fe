/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "react-bootstrap";
import "./RoomPreview.css"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from "react";
import {  useDispatch, useSelector } from "react-redux";
import {GiPerson} from "react-icons/gi"
import { getUsernameWithIDAction } from "../../redux/actions";


const RoomPreview = (props) => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const roomData = props.roomData;
    const user = useSelector(state => state.profileReducer.data)
    
    const users = roomData.users;
    const [roomID, setRoomID] = useState(roomData._id)
    const [roomCapacity, setRoomCapacity] = useState(roomData.capacity);
    const [roomLanguage, setRoomLanguage] = useState(roomData.language);
    const [roomLevel, setRoomLevel] = useState(roomData.level);
    const [roomCreatorID, setRoomCreatorID] = useState(roomData.creator);
    const [roomCreatorUsername, setRoomCreatorUsername] = useState("");
    
    const[usernames, setUsernames] = useState([]);
    
    
    //todo get username for the creator
    //todo get username of the users in the rooms
    const joinTheRoom = () => {
        console.log("join the room button triggered!")
        if(users.length < roomData.capacity){
            navigate(`/chatroom/${roomData.endpoint}`, {state: {user: user, roomID: roomData._id}})
        } else {
            window.alert("Room is full!")
        }
        
    }

    useEffect(() => {
        console.log("roomData users", roomData)

        getUsername(roomCreatorID).then((username) =>{setRoomCreatorUsername(username)})
        
        console.log("userssss=>", users)

        // const usernamesTemp = []
        // for (let i =0; i < users.length; i++){
        //     console.log("ddddd", users[i])
        //     getUsername(users[i]).then((username) => usernamesTemp.push(username))

        // }
        // setUsernames(usernamesTemp)
        const usernamesTemp = []
        for (let i =0; i < users.length; i++){
            getUsername(users[i]).then((username) => usernamesTemp.push(username))

        }
        setUsernames(usernamesTemp)

    }, [])

    
    const getUsername = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET"})
                if(response.ok) {
                    const userData = await response.json();
                    const username = userData.username;
                    resolve(username);
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        
    }

    // if(roomCapacity-(users?.length) <0) {
    //     window.location.reload();
    // }
    return  (<div className="room-preview">
                <div className="language-labels">
                    <div className="room-language">
                        {roomLanguage}
                    </div>
                    <div className="room-level">
                        {roomLevel}
                    </div>
                </div>
                <div className="room-creator d-flex flex-column mb-3">
                    <div className="room-creator-text">creator</div>
                    <div className="room-creator-username">{roomCreatorUsername}</div>
                </div>

                {/* <div className="room-online-users d-flex flex-column">
                    <div className="room-online-users-text">participants</div>
                    {users?.map(user =>  <div key={user}>{user}</div>)}
                </div> */}

                <div className="room-capacity d-flex">
                    {Array(users?.length).fill(<GiPerson className={"room-person room-person-full" }/>)}
                    {Array(roomCapacity-(users?.length)).fill(<GiPerson className={"room-person room-person-empty" }/>)}
                    {/* <GiPerson className="room-person room-person-full"/>
                    <GiPerson className="room-person room-person-available"/> */}
                </div>
                <div onClick={joinTheRoom} className="room-join-div">
                    Join the room
                </div>
            </div>)
            
            // <div className="d-flex flex-column room-preview-div">
            //     <div className="d-flex">
            //         <div>room id: {roomData._id}</div>
            //     </div>
            //     <div className="d-flex">
            //         <div>room capacity: {roomData.capacity}</div>
            //     </div>
            //     <div className="d-flex">
            //         <div>Language: {roomData.language}</div>
            //     </div>
            //     <div className="d-flex">
            //         <div>level: {roomData.level}</div>
            //     </div>
            //     <div className="d-flex">
            //         <div>creator: {roomData.creator}</div>
                    
            //     </div>
            //     <div>
            //         <h1>users in the room</h1>
            //         {users?.map(user =>  <div key={user}>{user}</div>)}
            //     </div>
                
            //     <Button onClick={joinTheRoom}>Join the room</Button>
            // </div>
}

export default RoomPreview;