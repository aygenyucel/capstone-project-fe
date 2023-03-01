import { Button, Container } from "react-bootstrap"
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";

const Room = (props) => {
    const [peerId, setPeerId] = useState(null)
    const [destPeerIdValue, setDestPeerIdValue] = useState("") // remote peer id
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
 
    useEffect(()  => {
        const peer = new Peer();
        
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id)
            setPeerId(id)

            //answering  call (triggers when we get a call)
            peer.on('call', (call) => {
                const getUserMedia = navigator.mediaDevices.getUserMedia 
                getUserMedia({video: true, audio: true})
                .then((stream) => {
                    call.answer(stream);// Answer the call with an A/V stream.
                    call.on('stream', (remoteStream) => {
                        // Show stream in some video/canvas element.
                        remoteVideoRef.current.srcObject = remoteStream
                        console.log("remoteVideoRef.current: ",remoteVideoRef.current)
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

        getUserMedia({video: true, audio:true})
        .then((stream) => {
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
                <div>
                    <input type="text" value={destPeerIdValue} onChange={e => setDestPeerIdValue(e.target.value)}/>
                    <Button onClick= {() => call(destPeerIdValue)} >Call</Button>
                </div>
                <div className="d-flex">
                    <video />
                    <video ref={remoteVideoRef} autoPlay/>
                </div>
            </div>
        </Container>
    )
}

export default Room