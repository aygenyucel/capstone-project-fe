import { Container } from "react-bootstrap"
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './peerJSGroupRoom.css'

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const PeerJSGroupRoom = (props) => {
    const params = useParams();
    const roomID = params.id;
    const [peerId, setPeerId] = useState(null)
    const peerRef = useRef(null);
    const currentUserVideoRef = useRef({});
    const remoteUserVideoRef =useRef({});
    const peersRef = useRef([])
    const [peers, setPeers] = useState([]);
    const [remoteUserId, setRemoteUserId] = useState("")
    const chatRooms = []//array of objects, objects contains roomIDs and userIDs in it
    //userID here represent the peerID, not socketid


    //TODO: save the participants inside REDUX store
    //TODO: when you create new peer and get the stream, save the peerID and stream inside REDUX store


    const addNewUserToChatRooms = (roomID, userID) => {
        const index = chatRooms.findIndex((room) => room.roomID === roomID);
        
        if(index !== -1) {
            chatRooms[index] = {roomID: roomID, users: [...chatRooms[index].users, userID] }
        } else {
           chatRooms.push({roomID: roomID, users: [userID]})
        }
        
    }
    const deleteUserFromChatRooms = (roomID, userID) => {
        const index = chatRooms.findIndex((room) => room.roomID === roomID); 
        if(index !== -1) {
            const updatedUsers = chatRooms[index].users.filter((user) => user !== userID)
            chatRooms[index] = {roomID, users: updatedUsers}
        }
        
    }

    const mediaConstraints = {video: true, audio: true}
    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    
    useEffect(()  => {
        const peer = new Peer();

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            setPeerId(id)
            console.log("roomID: ", roomID)
            socket.emit('join-room', {roomID, userID: id, chatRooms: chatRooms})
            addNewUserToChatRooms(roomID, id)
            console.log("users in this room after our connect: ", chatRooms)
            
            
        })
        
        peerRef.current = peer;
        
        getMediaDevices(mediaConstraints)
        .then(stream => {

            currentUserVideoRef.current.srcObject = stream;
            
            stream.getVideoTracks()[0].enabled = true; // by default local stream camera and mic will be off
            stream.getAudioTracks()[0].enabled = true;

            socket.on('user-connected', payload => {
                setRemoteUserId(payload.userID)

                addNewUserToChatRooms(roomID, payload.userID)
                console.log("users in this room after new connect: ", chatRooms)

                console.log("new user-connected: ", payload.userID)
                const call = peer.call(payload.userID, stream)

                call.on('stream', remoteStream => {
                    
                    remoteUserVideoRef.current.srcObject = remoteStream
                    //todo: find a way to hold that remoteStreams if more than one
                })
                // call.on('close', () => {
                // })
                // peers.push({userID: payload.userID, call })
                
            })

            peer.on('call', call => {
                
                call.answer(stream)
                call.on("stream", remoteStream => {
                    remoteUserVideoRef.current.srcObject = remoteStream
                })
            })

            socket.on('user-disconnect', payload => {
                deleteUserFromChatRooms(roomID, payload.userID)
                console.log("users in this room after disconnect: ", chatRooms)
                
            })




        })
        .catch(err => console.log("Failed to get local stream", err)) 



    }, [])


    return (
        <Container>
            <div className="d-flex flex-column">
                <div className="d-flex flex-column align-items-start">
                    <div>Current user peer id: {peerId}</div>

                    {/* video of current user */}
                    <div className="video-grid current-user-video-grid">
                        <video className="video current-user-video" ref={currentUserVideoRef} autoPlay muted/>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="d-flex flex-column align-items-start">
                        
                        <div>
                            {remoteUserId !== '' ?<div>remote user id: {remoteUserId}</div> : <div>remote user</div>}
                        
                        <div className="video-grid remote-user-video-grid">
                            <video className="video remote-user-vieo" ref={remoteUserVideoRef} autoPlay muted />
                        </div>
                        </div>
                        
                        
                    </div>
                </div>

            </div>
        </Container>
    )
}

export default PeerJSGroupRoom;