import './peerJSGroupRoom.css';
import { Container } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VideoPlayer } from '../../components/VideoPlayer';
import peersReducer from './../../redux/reducers/peersReduces';
import { addPeerAction } from '../../redux/actions';


const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const PeerJSGroupRoom = (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const roomID = params.id;
    const [myPeerId, setMyPeerId] = useState(null)
    const [remotePeerId, setRemotePeerId] = useState("")
    const myVideoRef = useRef({});
    const remoteVideoRef =useRef({});
    const chatRooms = []//array of objects, objects contains roomIDs and userIDs in it
    //userID here represent the peerID, not socketid

    const peers = useSelector((state) => state.peers)

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

    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    const mediaConstraints = {video: true, audio: true}
    
    useEffect(()  => {

        const peer = new Peer();

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            setMyPeerId(id)
            console.log("roomID: ", roomID)
            socket.emit('join-room', {roomID, userID: id, chatRooms: chatRooms})
            addNewUserToChatRooms(roomID, id)
            console.log("users in this room after our connect: ", chatRooms)
    
        })
        
        getMediaDevices(mediaConstraints)
        .then(stream => {
            myVideoRef.current.srcObject = stream;
            
            socket.on('user-connected', payload => {
                setRemotePeerId(payload.userID)
                addNewUserToChatRooms(roomID, payload.userID)
                console.log("users in this room after new connect: ", chatRooms)
                console.log("new user-connected: ", payload.userID)
                const call = peer.call(payload.userID, stream)

                call.on('stream', remoteStream => {
                    if(payload.userID !== myPeerId) dispatch(addPeerAction(payload.userID, remoteStream))
                    remoteVideoRef.current.srcObject = remoteStream
                })
                
            })

            peer.on('call', call => {
                call.answer(stream)
                call.on("stream", remoteStream => {
                    if(call.peer !== myPeerId) dispatch(addPeerAction(call.peer, remoteStream))
                    remoteVideoRef.current.srcObject = remoteStream
                })
                
            })

            socket.on('user-disconnect', payload => {
                deleteUserFromChatRooms(roomID, payload.userID)
                console.log("users in this room after disconnect: ", chatRooms)
                // dispatch(removePeerFromRoomAction(payload.userID, roomID))
                // dispatch(removePeerAction(payload.userID))
            })
        })
        .catch(err => console.log("Failed to get local stream", err)) 
    }, [])

    console.log({peers})

    return (
        <Container>
            <div className="d-flex flex-column">
                <div className="d-flex flex-column align-items-start">
                    <div>Current user peer id: {myPeerId}</div>
                    {/* video of current user */}
                    <div className="video-grid current-user-video-grid">
                        <video className="video current-user-video" ref={myVideoRef} autoPlay muted/>
                    </div>
                </div>
                {/* <div className="d-flex">
                    <div className="d-flex flex-column align-items-start">
                        <div>
                            <div>remote user id: {remotePeerId}</div>
                            <div className="video-grid remote-user-video-grid">
                                <video className="video remote-user-vieo" ref={remoteVideoRef} autoPlay  muted/>
                            </div>
                        </div>
                    </div>
                </div> */}
                
            </div>
        </Container>
    )
}

export default PeerJSGroupRoom;