/* eslint-disable react-hooks/exhaustive-deps */
import './chatRoom.css';
import {  Container, Row, Col } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import {  useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer.jsx';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction, updateRoomUsersAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';
import { useLocation } from 'react-router-dom';
import {AiOutlineAudio, AiOutlineAudioMuted} from 'react-icons/ai'
import {MdOutlineCallEnd} from 'react-icons/md'
import {BsCameraVideoOff, BsCameraVideo} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {VscUnmute} from 'react-icons/vsc'
import { useSelector } from 'react-redux';
import { isLoggedInAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import {HiHome, HiVideoCamera, HiPlus} from 'react-icons/hi'
import {FaUserFriends} from 'react-icons/fa'
import {MdSettings} from 'react-icons/md'
import { Form } from 'react-bootstrap';


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
    const navigate = useNavigate();
    const state = location.state;

    
    // const userData = state.user;
    const userData = useSelector(state => state.profileReducer.data)

    // const roomID = state.roomID;
    const [roomID, setRoomID] = useState("")


    const userID = userData?._id;
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
    // const [isSharingScreen, setIsSharingScreen] = useState(false)


    const [chatHistory, setChatHistory] = useState([]);
    const [text, setText] = useState("");
    const peerRef = useRef({})


    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    const mediaConstraints = {video: true, audio: true}


    const getRoomData = (roomEndpoint) => {
        return new Promise (async(resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/endpoint/${roomEndpoint}`, {method: "GET" })
                if(response.ok) {
                    const roomData = await response.json();
                    console.log("wtffff =>", roomData)
                    
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
                getRoomData(roomEndpoint).then(data => {setRoomData(data[0]);console.log("%%%%%%%%%%%", data[0]._id)})
                console.log("yes its logged in")
            } else {
                myStream.getTracks()
                .forEach((track) => track.stop());
                navigate("/login")
            }
        })
        .catch(err => console.log(err))
        
    },[])

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
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", users)
        if(users) {
            updateRoomUsersAction(users, roomID).then((action) => dispatch(action))
        }
    }, [users])


    window.onpopstate = () => {
        //for make sure the user disconnect from the chat room
        window.location.reload();
    }

    const leaveTheRoomHandler = () => {
        const updatedUsers = users.filter((user) => user !== userID)
        dispatch(removePeerAction(myPeerId, userID))
        updateRoomUsersAction(updatedUsers, roomID).then((action) => dispatch(action))

        //disable the webcam and mic before leave
        myStream.getTracks()
        .forEach((track) => track.stop());

    }
    
    window.onbeforeunload = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // eslint-disable-next-line no-param-reassign
        e.returnValue = 'onbeforeunload';
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
    
    // const getRoomData = (roomID) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/${roomID}`, {method: "GET"})
    //             if(response.ok) {
    //                 const roomData = await response.json();
    //                 resolve(roomData);
    //             }
    //         } catch (error) {
    //             console.log(error)
    //             reject(error)
    //         }
    //     })
    // }

    //*************chat area ***************/
    
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
            sendMessage();
            console.log(text)
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
        // console.log(message)

        setChatHistory([...chatHistory, newMessage])
    })
       
    }, [chatHistory])

    useEffect(() => {
        // console.log("chatttttHistory", chatHistory)
    }, [chatHistory])

    return (
        <div className='d-flex flex-row chatRoom-div'>
                            <div className='left-sidebar d-flex flex-column justify-content-between align-items-center'>
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
                                <div className='left-btn d-flex justify-content-center'>
                                    <div className="sidebar-user-avatar d-flex justify-content-center">
                                        <img src="/assets/avatar-default.png" alt="avatar-default" />
                                    </div>

                                </div>
                            
                            </div>
                            <div className=' main-area'>
                                <div className='main-top d-flex align-items-center justify-content-between'>
                                    <div className='d-flex'>
                                        <div className='main-top-language'>{roomData.language} - {roomData.level}</div>
                                        {/* <div className='main-top-level'>{roomData.level}</div> */}
                                    </div>
                                    <div>
                                        <div className='main-top-username'>{userData?.username}</div>
                                    </div>
                                    
                                    
                                </div>
                                <div className='main-bottom d-flex'>
                                    <div className='video-area d-flex flex-column justify-content-between'>
                                        {/* <div className='video-area-header d-flex'>
                                            <div>copylink</div>
                                            <div>invite</div>
                                        </div> */}
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
                                                        {peers?.map(peer => peer.userID !== userID && 
                                                            <Col sm={6} key={peer.userID}> 
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
                                    <div className='chat-area d-flex flex-column justify-content-between '>
                                        <div className='chat-messages-div'>
                                            {chatHistory?.map(message => 
                                                <div className={`chat-message d-flex flex-column ${(message.sender === userData.username)? 'my-message': 'user-message'}`}>
                                                    <div className='chat-message-sender d-flex justify-content-end'> {message?.sender}</div>
                                                    <div className='chat-message-text d-flex justify-content-start'>{message?.msg}</div>
                                                    {/* <div>{message}</div> */}
                                                </div>)}
                                            
                                        </div>
                                        <div className='chat-input-div d-flex justify-content-end'>
                                            <Form className="form" onSubmit={onSubmitHandler}>
                                                <Form.Group
                                                    className="form-group"
                                                    controlId="formBasicEmail"
                                                >
                                                    <Form.Control
                                                        className="form-control"
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
                    </div>
    )
}

export default ChatRoom;