import { Button, Container } from "react-bootstrap"
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";

const PeerJSRoom = (props) => {
    const [peerId, setPeerId] = useState(null)
    const [destPeerIdValue, setDestPeerIdValue] = useState("") // remote peer id
    const peerRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);

    useEffect(()  => {
        const peer = new Peer();
        
        peer.on('open', (id) => {
            // console.log('My peer ID is: ' + id)
            setPeerId(id)

            //answering  call (triggers when we get a call)
            peer.on('call', (call) => {
                const getUserMedia = navigator.mediaDevices.getUserMedia 
                getUserMedia({video: true, audio: false})
                .then((stream) => {
                    call.answer(stream);// Answer the call with an A/V stream.
                    currentUserVideoRef.current.srcObject = stream;
                    call.on('stream', (remoteStream) => {
                        // Show stream in some video/canvas element.
                        remoteVideoRef.current.srcObject = remoteStream
                        // console.log("remoteVideoRef.current: ", remoteVideoRef.current)
                    })
                })
                .catch(err => console.log("Failed to get local stream", err)) 
            })
        })

        peerRef.current = peer;
    }, [])

    //start a call
    const call = (destPeerId) => {
        const getUserMedia = navigator.mediaDevices.getUserMedia 

        getUserMedia({video: true, audio:false})
        .then((stream) => {
            currentUserVideoRef.current.srcObject = stream;

            const call = peerRef.current.call(destPeerId, stream);
            call.on('stream', (remoteStream) => {
                //Show stream in some video/canvas element.
                remoteVideoRef.current.srcObject = remoteStream;
            })
        })
        .catch(err => console.log("Failed to get local stream", err))
    }

    return (
        <Container>
            <div className="d-flex flex-column">
                <div>Current user peer id: {peerId}</div>
                <div>
                    <input type="text" value={destPeerIdValue} onChange={e => setDestPeerIdValue(e.target.value)}/>
                    <Button onClick= {() => call(destPeerIdValue)} >Call</Button>
                </div>
                <div className="d-flex flex-column">
                    <div className="d-flex">
                        <div>Current User: </div>
                    <video ref={currentUserVideoRef} autoPlay/>

                    </div>
                    <div className="d-flex">
                        <div>Remote User: </div>
                    <video ref={remoteVideoRef} autoPlay/>
                    </div>
                    
                    
                </div>
            </div>
        </Container>
    )
}

export default PeerJSRoom