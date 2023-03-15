/* eslint-disable react-hooks/exhaustive-deps */
import './chatRoom.css';
import { Button, Container, Row, Col } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer.jsx';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction, updateRoomUsersAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';
import { useLocation } from 'react-router-dom';
import CustomNavbar from './../../components/CustomNavbar/CustomNavbar';
import {AiOutlineAudio, AiFillAudio, AiOutlineAudioMuted} from 'react-icons/ai'
import {MdOutlineCallEnd} from 'react-icons/md'
import {BsCameraVideoOff, BsCameraVideo} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {VscUnmute, VscMute} from 'react-icons/vsc'

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const ChatRoom = (props) => {
    const location = useLocation()
    const params = useParams()
    const state = location.state;
    const userData = state.user;
    const roomID = state.roomID;
    const userID = userData._id;
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
    // const [isSharingScreen, setIsSharingScreen] = useState(false)

    const [roomData, setRoomData] = useState({})

    window.onbeforeunload = closing;
    var closing = function () {
        console.log("function alrt WORKS !!!!");
        window.alert("closing now.....");
       }
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
        let peerID;

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            console.log("roomEndpoint: ", roomEndpoint)
            setMyPeerId(id)
            peerID = id;
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
            console.log("jkfdshskjfjds", peerID, userID)

            dispatch(addPeerAction(peerID, stream, userID))
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
                        console.log("#################",payload.peerID, remoteStream, payload.userID)
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

    window.onbeforeunload =() => {
        leaveTheRoomHandler()
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

    const copyTheChatLink = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BE_DEV_URL}/chatroom/${roomEndpoint}`)
        window.alert("the room link copied!")
    }


    
    const getRoomData = (roomID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/${roomID}`, {method: "GET"})
                if(response.ok) {
                    const roomData = await response.json();
                    resolve(roomData);
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    useEffect(() => {
        getRoomData(roomID).then(data => setRoomData(data))
    }, [])

    

    return (
        // <Container>
        //     <div className='mb-3 mt-3'><a href='/rooms'><Button variant='danger' onClick={leaveTheRoomHandler}>Leave the room</Button></a></div>
        //     <div><Button variant='secondary' onClick={copyTheChatLink}>Copy the chat link</Button></div>
            
        //     <div className="d-flex flex-column">
        //         <div className="d-flex flex-column align-items-start mb-5">
        //             {/* <div>Current user peer id: {myPeerId}</div> */}
        //             {/* <div>Current userID: {userID}</div> */}
        //             <div>userName: {userData.username}</div>
        //             {/* video of current user */}
        //             <div className="video-grid current-user-video-grid d-flex flex-column">
        //                 <video className="video current-user-video" ref={myVideoRef} autoPlay/>
        //                 <div className='d-flex'>
        //                 {isMyCamOpen 
        //                 ? <Button className='me-2' onClick={toggleCamHandler}>hide your cam</Button> 
        //                 :  <Button className='me-2' onClick={toggleCamHandler}>open your cam</Button>}
        //                 {isMyMicOpen 
        //                 ? <Button  onClick={toggleMicHandler}>mute mic</Button> 
        //                 :  <Button onClick={toggleMicHandler}>open mic</Button>}
        //                 </div>

        //             </div>
        //         </div>
        //         <div className='d-flex flex-column'>
        //             <h1>Remote Peers: </h1>
        //             {currentPeersReducer.peers?.map(peer => peer.userID !== userID && 
        //             <div key={peer.userID}>
        //                 {/* <div>{peer.peerID}</div> */}
        //                 {/* <div>userrrrID: {peer.userID}</div> */}
        //                 <VideoPlayer stream = {peer.stream} userID = {peer.userID} />
        //             </div>)}
        //         </div>
        //     </div>
            
        // </Container>

        //********************************************************************************* */
        <div className='d-flex flex-row chatRoom-div'>
                            <div className='left-sidebar'>
                                sdjkfhsdjfs
                            </div>
                            <div className=' main-area'>
                                <div className='main-top d-flex align-items-center justify-content-between'>
                                    <div className='d-flex'>
                                        <div className='main-top-language'>{roomData.language}</div>
                                        <div className='main-top-level'>{roomData.level}</div>
                                    </div>
                                    <div>
                                        <div className='main-top-username'>{userData.username}</div>
                                    </div>
                                    
                                </div>
                                <div className='main-bottom d-flex'>
                                    <div className='video-area d-flex flex-column justify-content-between'>
                                        <div className='video-area-header d-flex'>
                                            <div>copylink</div>
                                            <div>invite</div>
                                        </div>
                                        <div className='video-area-player'>
                                            <div className='video-area-player-frame d-flex flex-column align-items-center justify-content-center'>
                                                <Container className='d-flex flex-column justify-content-center'>
                                                    <Row>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>
                                                                    <video className="video current-user-video" ref={myVideoRef} autoPlay/>
                                                                </div>
                                                                <div className='video-username'>you</div>
                                                            </div>
                                                        </Col>
                                                        {currentPeersReducer.peers?.map(peer => peer.userID !== userID && 
                                                            <Col sm={6}> 
                                                                <div className='position-relative'>
                                                                    <div className='video-player' key={peer.userID}>
                                                                            {/* <div>{peer.peerID}</div> */}
                                                                            {/* <div>userrrrID: {peer.userID}</div> */}
                                                                        <VideoPlayer stream = {peer.stream} userID = {peer.userID} />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                        {/* <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col> */}
                                                    </Row>
                                                    <Row>
                                                        {/* <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col> */}
                                                    </Row>
                                                </Container>
                                                
                                                
                                            </div>
                                        </div>
                                        <div className='video-area-footer d-flex justify-content-center align-items-center'>
                                            <div className='chat-btns mute-btn d-flex justify-content-center align-items-center'>
                                                <VscUnmute/>
                                                {/* <VscMute/> */}
                                            </div>
                                            <div className='chat-btns audio-btn d-flex justify-content-center align-items-center'>
                                                {isMyMicOpen 
                                                    ? <AiOutlineAudioMuted onClick={toggleMicHandler} /> 
                                                    :  <AiOutlineAudio onClick={toggleMicHandler} />}
                                            </div>
                                            <div className=' end-call-btn d-flex justify-content-center align-items-center'>
                                                <a href='/rooms'>
                                                    <MdOutlineCallEnd onClick={leaveTheRoomHandler}/>
                                                </a>
                                            </div>
                                            <div className='chat-btns chat-btns camera-btn d-flex justify-content-center align-items-center'>
                                                
                                                {isMyCamOpen 
                                                    ? <BsCameraVideoOff onClick={toggleCamHandler} /> 
                                                    :  <BsCameraVideo onClick={toggleCamHandler} />}
                                            </div>
                                            <div className='chat-btns settings-btn d-flex justify-content-center align-items-center'>
                                                <FiSettings/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='chat-area'>
                                        chat area
                                    </div>
                                </div>
                            </div>
                    </div>
    )
}

export default ChatRoom;