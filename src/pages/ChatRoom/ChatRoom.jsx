import './chatRoom.css';
import { Container } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const ChatRoom = (props) => {
    const params = useParams();
    const roomID = params.id;
    const [myPeerId, setMyPeerId] = useState(null)
    const [remotePeerId, setRemotePeerId] = useState("")
    const myVideoRef = useRef({});
    const remoteVideoRef =useRef({});
    const chatRooms = []
    //array of objects, objects contains roomIDs and userIDs in it
    //userID here represent the peerID, not socketid

    //accessing the peersReducer
    const [currentPeersReducer, dispatch] = useReducer(peersReducer, {})
    const peers = currentPeersReducer.peers

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
            console.log("roomID: ", roomID)
            setMyPeerId(id)
            socket.emit('join-room', {roomID, peerID: id})
            // addNewUserToChatRooms(roomID, id)
            // console.log("users in this room after our connect: ", chatRooms)
        })
        getMediaDevices(mediaConstraints)
        .then(stream => {
            myVideoRef.current.srcObject = stream;
            // adding our peer
            // dispatch(addPeerAction(myPeerId, stream))
            socket.on('user-connected', payload => {
                console.log("new user-connected => peerID: ", payload.peerID)
                setRemotePeerId(payload.peerID)
                // addNewUserToChatRooms(roomID, payload.userID)
                // console.log("users in this room after new connection: ", chatRooms)
                
                const call = peer.call(payload.peerID, stream)
                let id;

                //current peer send an offer to new peer 
                call.on('stream', remoteStream => {
                    //checking for prevent running the code twice.
                    if (id !== remoteStream.id) {
                        id = remoteStream.id
                        dispatch(addPeerAction(payload.peerID, remoteStream))
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("New peer get called and addPeerAction triggered! (the remote peer added)")
                    }
                })
                
            })

            peer.on('call', call => {
                call.answer(stream)
                let id;
                //curent peer answer the new peer's stream
                call.on("stream", remoteStream => {
                    if (id !== remoteStream.id) {
                        id = remoteStream.id
                        dispatch(addPeerAction(call.peer, remoteStream))
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("we answer the stream, addpeerAction triggered! (the owner of answer added")
                    }      
                }) 
            })

            socket.on('user-disconnected', payload => {
                console.log("xxxxxxxxxx user disconnected xxxxxxxxx", payload.peerID)
                dispatch(removePeerAction(payload.peerID))
            })
        })
        .catch(err => console.log("Failed to get local stream", err)) 
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        
        console.log("qq", peers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPeersReducer])



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
                <div className='d-flex flex-column'>
                    <h1>Remote Peers: </h1>
                    {currentPeersReducer.peers?.map(peer => <div>
                        <div>{peer.peerID}</div>
                        <VideoPlayer stream = {peer.stream}/>
                    </div>)}
                </div>
            </div>
        </Container>
    )
}

export default ChatRoom;