/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
import { useEffect } from 'react';
import "./videoPlayer.css"
import { useState } from 'react';

export const VideoPlayer = (props) => {
    const creatorUserName = props.creatorUserName
    const userID = props.userID
    let videoRef = useRef({});
    const [username, setUsername] = useState("")

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
        //TODO: get the user info with userID

        //TODO: get the media stream track information (screen sharing)

        //every time we update peers State, stream will be changed
    }, [props.stream])

    useEffect(() => {
        getUserData(userID).then((userData) => setUsername(userData.username))
    }, [])

    const getUserData = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET"})
                if(response.ok) {
                    const userData = await response.json();
                    resolve(userData);
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    return  <>  
                <video ref={videoRef} autoPlay className='video'/>
                <div className='video-username d-flex flex-column'>
                    <div>
                        {username} 
                    </div>
                </div>
                {username === creatorUserName && <div className='creator-label-other'>
                    host
                </div>}
                
            </>
}