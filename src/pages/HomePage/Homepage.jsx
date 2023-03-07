import CreateRoom from "../../components/CreateRoom.jsx";
import { useDispatch } from 'react-redux';
import { isLoggedInAction, resetPeersStateAction, resetRoomsStateAction } from "../../redux/actions/index.js";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import profileReducer from './../../redux/reducers/profileReducer';
import CreateCustomRoom from './../../components/CreateCustomRoom/CreateCustomRoom';
import RoomPreview from "../../components/RoomPreview/RoomPreview.jsx";
import roomsReducer from './../../redux/reducers/roomsReducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    
    const user = useSelector(state => state.profileReducer.data)

    const rooms = useSelector(state => state.roomsReducer.rooms)
    useEffect(() => {
        // dispatch(resetPeersStateAction());
        // dispatch(resetRoomsStateAction());
        console.log("user", user, "jwt: ", JWTToken)
        isLoggedInAction(user, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                setIsLoggedIn(true)
                console.log("yes its logged in")
            } else {
                navigate("/login")
            }
        })
        .catch(err => console.log(err))
    }, [])
    
    useEffect(() => {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxv", rooms)
    }, [rooms])
    return  isLoggedIn && <div className="d-flex flex-column">
                <div>{user.email}</div>
                <div>Home Page</div>
                <CreateRoom/>
                <div className="mt-5">
                    <CreateCustomRoom/>
                </div>
                <div>
                    <h3>All Rooms</h3>
                    {rooms?.map((room) => <RoomPreview id= {room._id} capacity = {room.capacity} language = {room.language} level = {room.level} creator = {room.creator}/>)}
                </div>
            </div>
}

export default HomePage;