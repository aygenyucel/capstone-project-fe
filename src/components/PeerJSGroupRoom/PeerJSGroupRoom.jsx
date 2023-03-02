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

    const [peerId, setPeerId] = useState(null)
    const peerRef = useRef(null);
    const roomID = params.id;
    const currentUserVideoRef = useRef({});
    const [peers, setPeers] = useState([]);
    const remoteUserVideoRef =useRef({});
    const [currentRemoteUserID, setCurrentRemoteUserID] = useState("")

    useEffect(()  => {
        const peer = new Peer();

        getMediaDevices(mediaConstraints)
        .then(stream => {
            currentUserVideoRef.current.srcObject = stream;

            peer.on('call', call => {
                call.answer(stream)
                call.on("stream", remoteStream => {
                    remoteUserVideoRef.current.srcObject = remoteStream
                    
                })
            })

            socket.on('user-connected', payload => {
                setCurrentRemoteUserID(payload.userID)
                
                console.log("new user-connected: ", payload.userID)
                //TODO: update and send all users info to online users
                const call = peer.call(payload.userID, stream)

                call.on('stream', remoteStream => {
                    remoteUserVideoRef.current.srcObject = remoteStream
                    
                    //todo: find a way to hold that remoteStreams if more than one
                    
                })

                peers.push({userID: payload.userID, call })
            })

        })
        .catch(err => console.log("Failed to get local stream", err)) 


        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            setPeerId(id)
            console.log("roomID: ", roomID)
            socket.emit('join-room', {roomID, userID: id})
        })

        peerRef.current = peer;

    }, [])

    const mediaConstraints = {video: true, audio: true}

    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }

    return (
        <Container>
            <div className="d-flex flex-column">
                <div className="d-flex flex-column align-items-start">
                    <div>Current user peer id: {peerId}</div>

                    {/* video of current user */}
                    <div className="video-grid">
                        <video className="video" ref={currentUserVideoRef} autoPlay muted/>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="d-flex flex-column align-items-start">
                        <div>remote user id: {currentRemoteUserID}</div>
                        <div className="video-grid">
                            <video className="video" ref={remoteUserVideoRef} autoPlay muted />
                        </div>
                    </div>
                </div>
                
                {/* video of other users in room*/}
                {/* TODO: ADD VIDEO GRID FOR EACH OTHER USER IN ROOM */}
                {/* {remoteUserVideoRef.current.forEach(remoteVideoRef => {
                    <video ref={remoteVideoRef} autoPlay muted />
                })} */}

            </div>
        </Container>
    )
}

export default PeerJSGroupRoom;