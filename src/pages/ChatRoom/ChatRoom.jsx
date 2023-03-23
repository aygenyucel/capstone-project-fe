/* eslint-disable react-hooks/exhaustive-deps */
import './chatRoom.css';
import {  Container, Row, Col } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import {  createBrowserRouter, Router, useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer.jsx';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction, updateRoomUsersAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';
import { useLocation } from 'react-router-dom';
import {AiOutlineAudio, AiOutlineAudioMuted, AiFillCopy} from 'react-icons/ai'
import {MdOutlineCallEnd, MdOutlineConnectWithoutContact} from 'react-icons/md'
import {BsCameraVideoOff, BsCameraVideo, BsFillChatLeftDotsFill} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {RxHamburgerMenu, RxPinLeft} from 'react-icons/rx'
import {BiLeftArrow, BiRightArrow} from 'react-icons/bi'

import {GiHamburgerMenu} from 'react-icons/gi'

import {VscUnmute} from 'react-icons/vsc'
import { useSelector } from 'react-redux';
import { isLoggedInAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import {HiHome, HiVideoCamera, HiPlus} from 'react-icons/hi'
import {FaUserFriends} from 'react-icons/fa'
import {MdSettings} from 'react-icons/md'
import { Form } from 'react-bootstrap';
import { addOnlineUsersAction } from './../../redux/actions/index';
import { Button } from 'react-bootstrap';

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const ChatRoom = (props) => {
    const location = useLocation()
    const params = useParams()
    // const userData = useSelector(state => state.profileReducer.data)
    // const userID = useSelector(state => state.profileReducer.data._id)
    const roomEndpoint = params.id;
    const [myPeerId, setMyPeerId] = useState(null)
    const myVideoRef = useRef({});
    const remoteVideoRef =useRef({});
    
    const [roomData, setRoomData] = useState({});
    const roomCapacity = roomData.capacity
    const roomCreatorID = roomData.creator;
    const [roomCreatorUsername, setRoomCreatorUsername] = useState("")
    const navigate = useNavigate();
    const state = location.state;

    
    // const userData = state.user;
    const userData = useSelector(state => state.profileReducer.data)

    
    const onlineChatUsers = useSelector(state => state.onlineChatUsersReducer.data)

    // const roomID = state.roomID;
    const [roomID, setRoomID] = useState("")
    
    
    const userID = userData?._id;
    const userName = userData?.username
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    //accessing the peersReducer
    const [currentPeersReducer, dispatch] = useReducer(peersReducer, {})
    const peers = currentPeersReducer?.peers?.filter(peer => peer.roomEndpoint === roomEndpoint)
    const usersFiltered = currentPeersReducer?.users?.filter(user => user.roomEndpoint === roomEndpoint)
    const users = usersFiltered?.map(user => user.userID)
    const chat = currentPeersReducer.chat
    
    
    const remotePeerRef = useRef({})
    const [usersArray, setUsersArray] = useState([])
    
    const [myStream, setMyStream] = useState({})
    const [isMyCamOpen, setIsMyCamOpen] = useState(false)
    const [isMyMicOpen, setIsMyMicOpen] = useState(false)

    const peerRef = useRef({})

    //chat variables
    const [chatHistory, setChatHistory] = useState([]);
    const [text, setText] = useState("");
    

    const resetFormValue = () => setText("");

    const onSubmitHandler = (event) => {
        event.preventDefault();
        resetFormValue();
    };
    const onChangeHandler = (event) => {
        setText(event.target.value);
    };
    const onKeyDownHandler = (event) => {
        if (event.code === "Enter") {
                if(/\S/.test(text)) {
                    sendMessage();
                    console.log(text)
                }
            
        }
    };

    const sendMessage = () => {
        const newMessage = {
            sender: userData.username,
            msg: text,
            time: new Date()
        }
        socket.emit("chatMessage", newMessage)
    };

    useEffect(() => {
        //message from server
        socket.on("message", newMessage => {
            setChatHistory([...chatHistory, newMessage])
        })
       
    }, [chatHistory])
    
    
    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    const mediaConstraints = {video: true, audio: true}


    const getUserInfo = (userID) => {
        return new Promise (async(resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET" })
                if(response.ok) {
                    const userData = await response.json();
                    console.log("cccccccccccccc", userData)
                    resolve(userData)
                } 
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    const getRoomData = (roomEndpoint) => {
        return new Promise (async(resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/endpoint/${roomEndpoint}`, {method: "GET" })
                if(response.ok) {
                    const roomData = await response.json();
                    
                    setRoomID(roomData[0]._id)
                    resolve(roomData)
                } 
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
    

    useEffect(() => {

        //checking if user logged in
        console.log("user", userData, "jwt: ", JWTToken)
        isLoggedInAction(userData, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                setIsLoggedIn(true)

                console.log("yes its logged in")
                
                getRoomData(roomEndpoint).then(data => {
                    setRoomData(data[0])
                    console.log("data ========>", data[0])
        
                    //check if room is already full, if it is navigate user to /rooms page
                    if( data[0].users.length  >=  data[0].capacity.toString()) {
                        alert("sorry the room is full :(")
                        const updatedUsers = data[0].users?.filter((user) => user !== userID)
                        dispatch(removePeerAction(myPeerId, userID))
                        updateRoomUsersAction(data[0].users, data[0]._id, userID).then((action) => dispatch(action))
                        window.location.replace('/rooms');
                    }

                    //getting the username of room creator
                    getUserInfo(data[0].creator).then(userData => {
                        console.log("ccccccccccccccccccccccc", userData)
                        setRoomCreatorUsername(userData.username)
                    })
                    
                    if(onlineChatUsers.findIndex(user => user === userID) !== -1){
                        alert("you are already in another room! please try again after leave current room")
                        window.location.replace('/rooms')
                    }
                    //todo: check if user already in another room, if it is, prevent user to join
                })

            } else {
                myStream.getTracks()
                .forEach((track) => track.stop());
                navigate("/login")
            }
        })
        .catch(err => console.log(err))
        
        
        console.log("users->", users)
        console.log("data========>", roomData)
    },[])
    
    useEffect(() => {
        console.log("---------------------------------onlinechattttusers", onlineChatUsers)
    }, [onlineChatUsers])


    useEffect(() => {
        getRoomData(roomEndpoint).then(data => {setRoomData(data[0])})        
    }, [chat])

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
            
            socket.emit('join-room', { peerID: id, userID: userID, roomID, roomCapacity, roomEndpoint})
             
        })

        getMediaDevices(mediaConstraints)
        .then(stream => {
            setMyStream(stream)
            myVideoRef.current.srcObject = stream;

            
            stream.getVideoTracks()[0].enabled = false
            stream.getAudioTracks()[0].enabled = false
            // adding our peer
            console.log("jkfdshskjfjds", "peerID:", peerID, "userID:", userID,"roomEndpoint:", roomEndpoint)
            
            
                dispatch(addPeerAction(peerID, stream, userID, roomEndpoint))

            socket.on('user-connected', payload => {
                
                console.log("new user-connected => peerID: ", payload.peerID, "userID:", payload.userID, "roomEndpoint:", payload.roomEndpoint)
                // console.log("users in this room after new connection: ", chatRooms)

                //we send the caller user info to who will answer it
                const options = {metadata: {"userID": userID, "roomEndpoint": roomEndpoint}};
                const call = peer.call(payload.peerID, stream, options)

                let id;
                //current peer send an offer to new peer 
                call.on('stream', remoteStream => {
                    //checking for prevent running the code twice.
                    if (id !== remoteStream.id) {
                        id = remoteStream.id
                        console.log("#################",payload.peerID, remoteStream, payload.userID)
                        dispatch(addPeerAction(payload.peerID, remoteStream, payload.userID, payload.roomEndpoint))
                        
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
                        dispatch(addPeerAction(call.peer, remoteStream, call.metadata.userID, call.metadata.roomEndpoint))
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("we answer the stream, addpeerAction triggered! (the owner of answer added)", call.metadata.userID, "xxxx")
                    }      
                }) 
            })

            remotePeerRef.current = peer

            socket.on('user-disconnected', payload => {
                console.log("xxxxxxxxxx user disconnected xxxxxxxxx", payload.peerID)
                
                dispatch(removePeerAction(payload.peerID, payload.userID))
                updateRoomUsersAction(payload.users, roomID, payload.userID).then((action) => dispatch(action))

                
            })
            
            socket.on("user-left", (payload) => {
                console.log("USER-LEFT PAYLOAD => ", payload.users)
                setUsersArray(payload.users)
                dispatch(removePeerAction(payload.peerID, payload.userID))
                updateRoomUsersAction(payload.users, roomID ,payload.userID).then((action) => dispatch(action))
                remotePeerRef.current.destroy()
            })

            socket.on("you-kicked", payload => {
                if(payload.userID === userID){
                    window.location.replace("/rooms")

                }
            })
            
        })
        .catch(err => console.log("Failed to get local stream", err)) 

    }, [])
    
    useEffect(() => { 
        console.log("peers =>", peers)
        console.log("currentPeersReducer => ", currentPeersReducer)
    }, [currentPeersReducer])

    useEffect(() => {
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", users)
        // if(users) {
        //     updateRoomUsersAction(users, roomID, userID).then((action) => dispatch(action))
        // }
    }, [users])


    window.onpopstate = () => {
        //for make sure the user disconnect from the chat room
        window.location.reload();
    }

    const leaveTheRoomHandler = () => {
        const updatedUsers = users?.filter((user) => user !== userID)
        dispatch(removePeerAction(myPeerId, userID))
        updateRoomUsersAction(updatedUsers, roomID, userID).then((action) => dispatch(action))

        //disable the webcam and mic before leave
        myStream.getTracks()
        .forEach((track) => track.stop());

    }

    window.onbeforeunload = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // eslint-disable-next-line no-param-reassign
        // e.returnValue = 'onbeforeunload';
        leaveTheRoomHandler();
      };

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

    const copyTheChatLink = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BE_DEV_URL}/chatroom/${roomEndpoint}`)
        window.alert("the room link copied!")
    }

    const kickTheUser = (e) => {
        socket.emit("kick-user", {userID: e.target.value, roomEndpoint});
    }


    

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory]);


    const [isChatOpen, setIsChatOpen] = useState(false)

    const toggleChatArea = () => {
        if (isChatOpen) {
            setIsChatOpen(false)
            
        } else {
            setIsChatOpen(true)
        }
    }
    
    const closeChatArea = () => {
        if (isChatOpen) {
            setIsChatOpen(false)
            
        }
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        if(isSidebarOpen) {
            setIsSidebarOpen(false)
        } else {
            setIsSidebarOpen(true)
        }
    }

    const closeSidebar = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false)
            
        }
    }
    return (
        <div className='d-flex flex-row chatRoom-div'>
                            <div className='left-sidebar  flex-column justify-content-between align-items-center'>
                                <div className="navbar-logo d-flex justify-content-center">
                                    sipeaky
                                </div>
                                <div className='sidebar-btns d-flex flex-column justify-content-center align-items-center'>
                                    <div className='d-flex justify-content-center'>
                                        <HiHome/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <HiVideoCamera/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <FaUserFriends/>
                                    </div>
                                    <div>
                                        <HiPlus/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <MdSettings/>
                                    </div>
                                </div>
                                <div className='left-btn d-flex justify-content-center flex-column'>
                                    <div className="sidebar-user-avatar d-flex justify-content-center mb-3">
                                        <img src="/assets/avatar-default.png" alt="avatar-default" />
                                    </div>

                                    <div>
                                        <RxPinLeft/>
                                    </div>

                                </div>
                            
                            </div>
                            
                            <div className=' main-area position-relative' onClick={closeSidebar}>
                                <div className='main-top d-flex align-items-center justify-content-between position-relative'>
                                    <div className='d-flex justify-content-center align-items-center'>

                                       
                                        
                                        <div className='main-top-language me-3'>{roomData.language} - {roomData.level}</div>
                                        {/* <div className='main-top-level'>{roomData.level}</div> */}
                                        <div className='main-top-host'>
                                            <div>host:</div> 
                                            <div className='ms-1 main-top-creator'>{roomCreatorUsername}</div>
                                        </div>

                                        <div className='main-top-host-mobile'>
                                            <div>host:</div> 
                                            <div className='ms-1 main-top-creator'>{roomCreatorUsername}</div>
                                        </div>
                                        
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        
                                        <div className='copy-link-div d-flex' onClick={copyTheChatLink}>
                                            <div>copy the chat link</div> 
                                            <AiFillCopy onClick={copyTheChatLink} className="copy-link-btn"/>
                                        </div>
                                        
                                        <div className='main-top-username'>{userData?.username}</div>

                                        
                                        {/* sidebar for the tablet and phones */}
                                        <div className='sidebar-burger' onClick={toggleSidebar}>
                                                <GiHamburgerMenu/>
                                        </div>
                                    </div>
                                </div>
                                <div className={`left-sidebar-mobile flex-column justify-content-between align-items-center ${isSidebarOpen? "left-sidebar-mobile-open": "left-sidebar-mobile-close"}`}>
                                    <div className="navbar-logo d-flex justify-content-center">
                                        sipeaky
                                    </div>
                                    <div className='sidebar-btns d-flex flex-column justify-content-center align-items-center'>
                                        <div className='d-flex justify-content-center'>
                                            <HiHome/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <HiVideoCamera/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <FaUserFriends/>
                                        </div>
                                        <div>
                                            <HiPlus/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <MdSettings/>
                                        </div>
                                    </div>
                                    <div className='left-btn d-flex justify-content-center flex-column'>
                                        <div className="sidebar-user-avatar d-flex justify-content-center mb-3">
                                            <img src="/assets/avatar-default.png" alt="avatar-default" />
                                        </div>

                                        <div>
                                            <RxPinLeft/>
                                        </div>

                                    </div>
                                
                                </div>
                                <div className='main-bottom d-flex'>
                                    <div className='video-area d-flex flex-column justify-content-between'>
                                        {/* <div className='video-area-header '>
                                            
                                        </div> */}
                                        <div className='video-area-player'>
                                            <div className='video-area-player-frame d-flex flex-column align-items-center justify-content-center'>
                                                <Container className='d-flex flex-column justify-content-center'>
                                                    <Row>
                                                        <Col sm={6} className="video-player-col position-relative"> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>
                                                                    <video className="video current-user-video" ref={myVideoRef} autoPlay/>
                                                                </div>
                                                                <div className='video-username your-username d-flex flex-column'>
                                                                    <div>you</div>
                                                                    </div>
                                                            </div>
                                                            {userName === roomCreatorUsername && <div className='creator-label'>host</div>}
                                                            
                                                        </Col>
                                                        {peers?.map(peer => peer.userID !== userID && 
                                                            <Col sm={6} key={peer.userID} className="video-player-col"> 
                                                                <div className='position-relative'>
                                                                    <div className='video-player' key={peer.userID}>
                                                                            {/* <div>{peer.peerID}</div> */}
                                                                            {/* <div>userrrrID: {peer.userID}</div> */}
                                                                        <VideoPlayer stream = {peer.stream} userID = {peer.userID} creatorUserName = {roomCreatorUsername}/>
                                                                    </div>
                                                                    <div>
                                                                        {userName === roomCreatorUsername && 
                                                                        <button className='kick-btn d-flex justify-content-center align-items-center' value={peer.userID} onClick={kickTheUser}>
                                                                            kick
                                                                            {/* <img src="/assets/kick-icon.jpg" alt="kick"  />  */}
                                                                        {/* <button className='kick-btn' value={peer.userID} onClick={kickTheUser}>Kick</button> */}
                                                                        </button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                    
                                                </Container>
                                                
                                            </div>
                                        </div>
                                        <div className='video-area-footer d-flex justify-content-center align-items-center position-relative'>
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
                                                <FiSettings className='settings-icon'/>
                                                <BsFillChatLeftDotsFill className='chat-icon-footer' onClick={toggleChatArea}/>
                                            </div>
                                            
                                        </div>

                                        
                                        
                                    </div>
                                    <div className='chat-area '>
                                        <div className='chat-messages-div d-flex flex-column '>
                                            {chatHistory?.map(message => 
                                            <div className={`chat-message-display d-flex flex-column ${(message.sender === userData.username)? 'align-items-end': 'align-items-start'}`}>
                                                {message.sender !== userData.username ?  <div className='chat-message-sender d-flex justify-content-end'> {message?.sender}</div>: <></>}
                                                   
                                                <div className={`chat-message d-flex flex-column ${(message.sender === userData.username)? 'my-message ': 'user-message'}`}>
                                                    <div className='chat-message-text d-flex justify-content-start'>{message?.msg}</div>
                                                </div>
                                             </div>
                                            )}
                                             <div ref={messagesEndRef} />
                                        </div>
                                            
                                        <div className='chat-input-div d-flex justify-content-center align-items-center'>
                                            <Form className="form d-flex justify-content-center align-items-center" onSubmit={onSubmitHandler}>
                                                <Form.Group
                                                    className="form-group d-flex justify-content-center align-items-center"
                                                    controlId="formBasicEmail"
                                                >
                                                    <Form.Control
                                                        className="form-control chat-input"
                                                        type="text"
                                                        placeholder="Type a message"
                                                        onChange={onChangeHandler}
                                                        value={text}
                                                        onKeyDown={onKeyDownHandler}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='chat-mobile-btn  position-absolute' onClick={toggleChatArea}>
                                    {/* <div>chat</div> */}
                                    <BiLeftArrow className='left-arrow-icon'/>
                                    <BsFillChatLeftDotsFill className='chat-icon'/>
                                </div>
                                <div className={`chat-area-mobile position-absolute ${isChatOpen ? `chat-area-mobile-open`: `chat-area-mobile-close`}`}>

                                    <div className='chat-area-mobile-toggle position-absolute ' onClick={toggleChatArea}>
                                        <BiRightArrow/>
                                    </div>
                                        <div className='chat-messages-div d-flex flex-column '>
                                            {chatHistory?.map(message => 
                                            <div className={`chat-message-display d-flex flex-column ${(message.sender === userData.username)? 'align-items-end': 'align-items-start'}`}>
                                                {message.sender !== userData.username ?  <div className='chat-message-sender d-flex justify-content-end'> {message?.sender}</div>: <></>}
                                                   
                                                <div className={`chat-message d-flex flex-column ${(message.sender === userData.username)? 'my-message ': 'user-message'}`}>
                                                    <div className='chat-message-text d-flex justify-content-start align-items-start'>{message?.msg}</div>
                                                </div>
                                             </div>
                                            )}
                                             <div ref={messagesEndRef} />
                                        </div>
                                            
                                        <div className='chat-input-div d-flex justify-content-center align-items-center'>
                                            <Form className="form d-flex justify-content-center align-items-center" onSubmit={onSubmitHandler}>
                                                <Form.Group
                                                    className="form-group d-flex justify-content-center align-items-center"
                                                    controlId="formBasicEmail"
                                                >
                                                    <Form.Control
                                                        className="form-control chat-input"
                                                        type="text"
                                                        placeholder="Type a message"
                                                        onChange={onChangeHandler}
                                                        value={text}
                                                        onKeyDown={onKeyDownHandler}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                            </div>
                    </div>
    )
}

export default ChatRoom;