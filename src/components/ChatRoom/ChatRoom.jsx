import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { io } from "socket.io-client";
import "./chatRoom.css";

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})


const ChatRoom = () => {

    useEffect(() => {
        socket.on("welcome", welcomeMessage => {
            console.log(welcomeMessage,"xxxxxx")
        })
    })

    return <Container>
        <div className="d-flex flex-column mt-2">
            <div>CHAT ROOM</div>
            <div className="d-flex mt-2 justify-content-between">
                <div>left side </div>
                <div>right side</div>
            </div>
            
        </div>
    </Container>
}
export default ChatRoom;