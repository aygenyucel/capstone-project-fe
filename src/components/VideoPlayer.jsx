
import { useRef } from 'react';
import { useEffect } from 'react';
export const VideoPlayer = (props) => {
    let videoRef = useRef({});

    useEffect(() => {
        videoRef = props.stream
    }, [])

    return <><div>dfsjkfslfsdf</div> <video ref={videoRef} autoPlay/></>
}