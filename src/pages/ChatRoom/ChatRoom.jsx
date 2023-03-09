/* eslint-disable react-hooks/exhaustive-deps */
import './chatRoom.css';
import { Button, Container } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction, updateRoomUsersAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';
import { useLocation } from 'react-router-dom';

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"], closeOnBeforeunload: false})

const ChatRoom = (props) => {
    const location = useLocation()
    const params = useParams()
    const state = location.state;
    const userData = state.user;
    const roomID = state.roomID;
    const userID = userData._id 
    const roomEndpoint = params.id;
    const [myPeerId, setMyPeerId] = useState(null)
    const myVideoRef = useRef({});
    const remoteVideoRef =useRef({});


    //accessing the peersReducer
    const [currentPeersReducer, dispatch] = useReducer(peersReducer, {})
    const peers = currentPeersReducer.peers
    const users = currentPeersReducer.users

    const remotePeerRef = useRef({})
    const [usersArray, setUsersArray] = useState([])

    const [myStream, setMyStream] = useState({})
    const [isMyCamOpen, setIsMyCamOpen] = useState(false)
    const [isMyMicOpen, setIsMyMicOpen] = useState(false)
    const [isSharingScreen, setIsSharingScreen] = useState(false)
    

    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    const mediaConstraints = {video: true, audio: true}

    
    useEffect(()  => {
        console.log(":)))) userData => ", userData)

        const peer = new Peer({
            config: {'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
              ]} 
        });

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            console.log("roomEndpoint: ", roomEndpoint)
            setMyPeerId(id)
            socket.emit('join-room', {roomEndpoint, peerID: id, userID: userID, roomID })
            
           socket.on('user-join', payload => {
                console.log("USER-JOIN PAYLOAD => ", payload.users)
                setUsersArray(payload.users)
            })    
        })
        
        getMediaDevices(mediaConstraints)
        .then(stream => {
            
            setMyStream(stream)
            myVideoRef.current.srcObject = stream;

            stream.getVideoTracks()[0].enabled = false
            stream.getAudioTracks()[0].enabled = false
            // adding our peer
            dispatch(addPeerAction(myPeerId, stream, userID))
            socket.on('user-connected', payload => {
                console.log("new user-connected => peerID: ", payload.peerID, "userID:", payload.userID)
                // console.log("users in this room after new connection: ", chatRooms)

                //we send the caller user info to who will answer it
                const options = {metadata: {"userID": userID}};
                const call = peer.call(payload.peerID, stream, options)

                let id;
                //current peer send an offer to new peer 
                call.on('stream', remoteStream => {
                    //checking for prevent running the code twice.
                    if (id !== remoteStream.id) {
                        id = remoteStream.id
                        dispatch(addPeerAction(payload.peerID, remoteStream, payload.userID))
                        
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("New peer get called and addPeerAction triggered! (the remote peer added)", payload.userID)     
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
                        //we get the metadata sended from caller (call.metadata.userID)
                        dispatch(addPeerAction(call.peer, remoteStream, call.metadata.userID))
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("we answer the stream, addpeerAction triggered! (the owner of answer added)", call.metadata.userID, "xxxx")
                    }      
                }) 
            })

            remotePeerRef.current = peer

            socket.on('user-disconnected', payload => {
                console.log("xxxxxxxxxx user disconnected xxxxxxxxx", payload.peerID)
                
                dispatch(removePeerAction(payload.peerID, payload.userID))
                updateRoomUsersAction(payload.users, roomID).then((action) => dispatch(action))
                
            })
            
            socket.on("user-left", (payload) => {
                console.log("USER-LEFT PAYLOAD => ", payload.users)
                setUsersArray(payload.users)
                dispatch(removePeerAction(payload.peerID, payload.userID))
                updateRoomUsersAction(payload.users, roomID).then((action) => dispatch(action))
                remotePeerRef.current.destroy()
            })
        })
        .catch(err => console.log("Failed to get local stream", err)) 
    }, [])
    
    useEffect(() => { 
        console.log("peers =>", peers)
        console.log("currentPeersReducer => ", currentPeersReducer)
    }, [currentPeersReducer])

    useEffect(() => {
        updateRoomUsersAction(users, roomID).then((action) => dispatch(action))
    }, [users])


    window.onpopstate = () => {
        //for make sure the user disconnect from the chat room
        window.location.reload();
    }
    
    const leaveTheRoomHandler = () => {
        const updatedUsers = users.filter((user) => user !== userID)
        dispatch(removePeerAction(myPeerId, userID))
        updateRoomUsersAction(updatedUsers, roomID).then((action) => dispatch(action))
    }

    const toggleCamHandler = () => {
        const videoTrack = myStream.getTracks().find(track => track.kind === 'video')
        if(videoTrack.enabled) {
            videoTrack.enabled = false;
            setIsMyCamOpen(false)
        } else {
            videoTrack.enabled = true;
            setIsMyCamOpen(true)
        }
    }

    const toggleMicHandler = () => {
        const audioTrack = myStream.getTracks().find(track => track.kind === 'audio')
        if(audioTrack.enabled) {
            audioTrack.enabled = false;
            setIsMyMicOpen(false)
        } else {
            audioTrack.enabled = true;
            setIsMyMicOpen(true)
        }
    }

    // const toggleShareScreenHandler = () => {
    //     //we are accessing the media stream, not video stream
    //     if(isSharingScreen) {
    //         navigator.mediaDevices.getUserMedia({video:isMyCamOpen, audio: isMyMicOpen})
    //         .then(stream => myVideoRef.current.srcObject = stream)
    //         .then(setIsSharingScreen(false))
            
    //     } else {
    //         navigator.mediaDevices.getDisplayMedia({})
    //         .then(stream => myVideoRef.current.srcObject = stream)
    //         .then(setIsSharingScreen(true))
            
    //     }
    // }

    return (
        <Container>
            <div><a href='/'><Button onClick={leaveTheRoomHandler}>Leave the room</Button></a></div>
            
            <div className="d-flex flex-column">
                <div className="d-flex flex-column align-items-start mb-5">
                    <div>Current user peer id: {myPeerId}</div>
                    <div>Current userID: {userID}</div>
                    <div>userName: {userData.username}</div>
                    {/* video of current user */}
                    <div className="video-grid current-user-video-grid d-flex flex-column">
                        <video className="video current-user-video" ref={myVideoRef} autoPlay/>
                        <div className='d-flex'>
                        {isMyCamOpen 
                        ? <Button className='me-2' onClick={toggleCamHandler}>hide your cam</Button> 
                        :  <Button className='me-2' onClick={toggleCamHandler}>open your cam</Button>}
                        {isMyMicOpen 
                        ? <Button  onClick={toggleMicHandler}>mute mic</Button> 
                        :  <Button onClick={toggleMicHandler}>open mic</Button>}
                        </div>
                        {/* <div className='d-flex mt-3'>
                            {isSharingScreen 
                            ? <Button variant='secondary' onClick={toggleShareScreenHandler}>stop sharing</Button> 
                            :  <Button variant='secondary' onClick={toggleShareScreenHandler}>share your screen</Button>}
                        </div> */}

                    </div>
                </div>
                <div className='d-flex flex-column'>
                    <h1>Remote Peers: </h1>
                    {currentPeersReducer.peers?.map(peer => peer.userID !== userID && 
                    <div key={peer.userID}>
                        <div>{peer.peerID}</div>
                        <VideoPlayer stream = {peer.stream} userID = {peer.userID} />
                    </div>)}
                </div>
            </div>
            
        </Container>
    )
}

export default ChatRoom;