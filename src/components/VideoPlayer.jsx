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

        //every time we update peers State, stream will be changed
    }, [props.stream])

    return  <>
                <div className='video-player-container d-flex flex-column'>
                    <div>userID: {userID}</div>
                    <div><video ref={videoRef} autoPlay muted width="300" height="200"  className='ms-2'/></div>
                </div>
            </>
}