import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { io } from "socket.io-client";
import "./chatRoom.css";

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const ChatRoom = () => {
    const [clientId, setClientId] = useState("")
    const [usersOnCall, setusersOnCall] = useState([])
    const [isUserJoinCall, setIsUserJoinCall] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false)
    const [stream, setStream] = useState()

    const mediaConstraints = {
        'video':true,
        'audio': true
    }

    const openMediaDevices = async() => {
        return await navigator.mediaDevices.getUserMedia(mediaConstraints);
    }
    
    const joinCall = async () => {
        openMediaDevices()
        .then(stream => {setStream(stream);
            socket.emit("broadcaster")})
        .then(socket.emit("usersOnCall", clientId))
        .then(setIsUserJoinCall(true))
        .catch(error => console.error(error));
    }

    useEffect(() => {
        socket.on("clientId",  payload => {
            setClientId(payload);
            console.log("Client ID: ", payload)

            socket.emit("setClientId", clientId)

            socket.on("loggedIn", usersOnCall => {
                console.log("logged in event:", usersOnCall)
                setLoggedIn(true)
                setusersOnCall(usersOnCall)
              })
            
            socket.on("updateUsersOnCall", payload => {
                setusersOnCall(payload);
            })
        })
    })
    return <Container>
                <div className="d-flex flex-column mt-2">
                    <div>CHAT ROOM</div>
                    <div className="d-flex mt-2 justify-content-between">
                        <div className="d-flex flex-column">
                            <div>LEFT SIDE</div>
                            <div><small>{clientId}</small></div>
                            <div><button onClick={joinCall} disabled = {isUserJoinCall}>Join Call</button></div>
                        </div>
                        <div className="d-flex flex-column">
                            <div>users on call</div>
                            <div>
                                {usersOnCall.map((user) => 
                                    <div>{user.socketId}</div>
                                )}
                            </div>
                        </div>
                        <div>RIGHT SIDE</div>
                    </div>
                </div>
            </Container>
}
export default ChatRoom;