import { isDisabled } from "@testing-library/user-event/dist/utils";
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
    // const [roomId, setRoomId]  = useState("12345")
    // const [RTCPeerConnection, setRTCPeerConnection] = useState()
    // const [localStream, setLocalStream] = useState()

    // const promise = navigator.mediaDevices.getUserMedia(constraints)

    const mediaConstraints = {
        'audio': true
    }
    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
        ],
    }

    let pc = new RTCPeerConnection(iceServers)
    let localStream = null;
    let remoteStream = null;

    const openMediaDevices = async() => {
        return await navigator.mediaDevices.getUserMedia(mediaConstraints);
    }
    
    const joinCall = async () => {
        localStream = await openMediaDevices()
        .then(socket.emit("usersOnCall", clientId))
        .then(setIsUserJoinCall(true))

        remoteStream = new MediaStream();

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        })

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            })
        }

        
    }

    useEffect(() => {
        // socket.on("welcome", welcomeMessage => {
        //     console.log(welcomeMessage,"xxxxxx")
        // })
        socket.on("clientId",  payload => {
            setClientId(payload);
            console.log(payload,"xxxxxxxxxx")

            socket.emit("setClientId", clientId)

            socket.on("loggedIn", usersOnCall => {
                console.log("logged in event:", usersOnCall)
                setLoggedIn(true)
                setusersOnCall(usersOnCall)
              })
            
            socket.on("updateUsersOnCall", payload => {
                console.log("xxxxx online users xxxx", payload)
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

                    
                    
                    
                    <div>online users</div>
                
                <div>{usersOnCall.map((user) => 
                <div>{user.socketId}</div>
                )}</div></div>
                <div>right side</div>
            </div>
            
            
        </div>
    </Container>
}
export default ChatRoom;