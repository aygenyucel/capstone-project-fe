import React from "react";
import {useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {

    const navigate = useNavigate()

    function createSimplePeerRoom() {
        const id = uuid();
        navigate(`/simplePeerRoom/${id}`);
    }

    function goToPeerJSRoom() {
        navigate(`/peerJSRoom`, );
    }

    function goToPeerJSGroupRoom(){
        const id = uuid();
        navigate(`/peerJSGroupRoom/${id}`)
    }

    return (
        <div className="d-flex flex-column">
            <div className="mt-3"><button onClick={createSimplePeerRoom}>Create <strong>simple-peer</strong> room</button></div>
            <div className="mt-3"><button onClick={goToPeerJSRoom}>Go to <strong>peerJS</strong> room</button></div>
            <div className="mt-3"><button onClick={goToPeerJSGroupRoom}> Go to <strong>peerJS</strong> group call room </button></div>
            
        </div>
    );
};

export default CreateRoom;