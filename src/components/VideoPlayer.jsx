/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
import { useEffect } from 'react';
import "../components/videoPlayer.css"

export const VideoPlayer = (props) => {
    const userID = props.userID
    let videoRef = useRef({});

    useEffect(() => {
        videoRef.current.srcObject = props.stream
        console.log("videPlayer triggered")
        console.log("cccc", props.stream.enabled)


        //checking if the webcam of user open or not
        const videoTrack = props.stream.getTracks().find(track => track.kind === 'video')
        if(videoTrack.enabled) {
            videoTrack.enabled = true;
        } else {
            videoTrack.enabled = false;
        }

        const audioTrack = props.stream.getTracks().find(track => track.kind === 'audio')
        if(audioTrack.enabled) {
            audioTrack.enabled = true;
        } else {
            audioTrack.enabled = false;
        }

        //every time we update peers State, stream will be changed
    }, [props.stream])
    

    return  <>
                <div className='video-player-container d-flex flex-column'>
                    <div>userID: {userID}</div>
                    <div><video ref={videoRef} autoPlay width="300" height="200"  className='ms-2'/></div>
                </div>
            </>
}