/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
import { useEffect } from 'react';

export const VideoPlayer = (props) => {
    let videoRef = useRef({});

    useEffect(() => {
        videoRef.current.srcObject = props.stream
        console.log("videPlayer triggered")

        //every time we update peers State, stream will be changed
    }, [props.stream])

    return  <>
                <video ref={videoRef} autoPlay muted width="350" height="200" />
            </>
}