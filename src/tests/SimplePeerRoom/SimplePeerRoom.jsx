import Peer from "simple-peer";
import {io }from "socket.io-client";
import { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useParams } from "react-router-dom";
import SimplePeer from "simple-peer";

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})


const Video = (props) => {
    const ref = useRef();

    // useEffect(() => {
    //     props.peer.on("stream", stream => {
    //         ref.current.srcObject = stream;
    //     })
    // }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    );
}


const SimplePeerRoom = (props) => {
    const params = useParams();
    const [peers, setPeers] = useState([]);
    const currentUserVideoRef = useRef({});
    const peersRef = useRef([]);
    const roomID = params.id;
    const otherUsersInThisRoom =useRef([]);

    const getUserMedia = async(mediaConstraints) => {
        try {
            const userMedia = await  navigator.mediaDevices.getUserMedia(mediaConstraints);
            return userMedia;
        } catch (err){
            console.log(err)
        }
    }
    const mediaConstraints = {video: true, audio: true}
    
    useEffect(() => {
        socket.on("clientId",  socketId => { 
            console.log("welcome, ", socketId)
            getUserMedia(mediaConstraints)
            .then((stream) => {
                console.log(stream)
               currentUserVideoRef.current.srcObject = stream;

               socket.emit("joinRoom", roomID); 
               //Add the new user in this room if possible (joinRoom)
               //Listen BE for getting other users in this room ()


               socket.on("otherUsersInThisRoom", payload => {
                    //for each other user in this room:
                    //*create a new peer, send the signal to them (sending signal), listen (newUserJoined)
                    //*add the peerID and peer itself to peersRef
                    //*add peer to peers
                    const peersUpdated = []
                    payload.forEach(otherUserId => {
                        const peer = new SimplePeer({
                            initiator: true, //set to true if this is the initiating peer
                            trickle: false, //set to false to disable trickle ICE and get a single 'signal' event (slower)
                            stream
                        })
                        peer.on("signal", signalData => {
                            
                            socket.emit("sendingSignal", {otherUserId, socketId, signalData})
                            peersRef.current.push({peerID: otherUserId, peer: peer})
                            peersUpdated.push(peer)
                        })
                    })
                    setPeers(peersUpdated)
               }) 

               socket.on("newUserJoined", payload => {
                    //create new peer for new joined user
                    //send to returning signal to new user (returning signal), listen (receiving returned signal)
                    //add the new user to peersRef
                    //add the new user to peer
                    // const peer = addPeer(payload.signal, payload.callerID, stream);

                    const callerID = payload.callerID;
                    const peer = new SimplePeer({
                        initiator: false,
                        trickle: false,
                        stream
                        
                    })
                    
                    peer.signal(payload.signalData)
                    peer.on("signal", signalData => {
                        console.log("½½½½½½½½½½½½½½½½½½½½½½½½½")
                        socket.emit("sendingReturningSignal", {callerID, signalData})
                    })

                    console.log("new user joined!!!!!!!")
                    peersRef.current.push({peerID: socketId, peer: peer})
                    setPeers([...peers, peer])
               })

                socket.on("receivingReturnedSignal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    console.log("#### item.peer ### ", item.peer );
                    item.peer.signal(payload.signal);
                })
                
            })
            .catch(err => console.log(err))
        })
    }, []);

    console.log("### peersRef.current  ", peersRef.current)
    console.log("### peers  ", peers)


    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("sendingReturningSignal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    return <Container>
                <div className="d-flex flex-column">
                    <div>
                        {peers.forEach(peer => {
                            return <video ref={currentUserVideoRef} autoPlay/>
                        })}
                    </div>
                    <div>######################################</div>
                    <div>
                        {peers.map((peer, index) => {
                            return (
                                <Video key={index} peer={peer}/>
                            );
                        })}
                    </div>
                </div>  
            </Container>
}

export default SimplePeerRoom;