import React from "react";
import {useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
    const navigate = useNavigate()
    function create() {
        const id = uuid();

        navigate(`/groupChatRoom/${id}`, {state: {roomID: id}});
    }

    return (
        <div>
            <button onClick={create}>Create room</button>

        </div>
    );
};

export default CreateRoom;