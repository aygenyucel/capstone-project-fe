/* eslint-disable react-hooks/exhaustive-deps */
import CreateRoom from "../../components/CreateRoom.jsx";
import { useDispatch } from 'react-redux';
import { getAllRoomsAction, isLoggedInAction, removePeerAction, updateRoomUsersAction} from "../../redux/actions/index.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import CreateCustomRoom from './../../components/CreateCustomRoom/CreateCustomRoom';
import RoomPreview from "../../components/RoomPreview/RoomPreview.jsx";
import peersReducer from './../../redux/reducers/peersReducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const user = useSelector(state => state.profileReducer.data)
    const rooms = useSelector(state => state.roomsReducer.rooms)
    const users = useSelector(state => state.peersReducer.users)
    
    useEffect(() => {
        // dispatch(resetPeersStateAction());
        // dispatch(resetRoomsStateAction());
        getAllRoomsAction()
        .then((action) => dispatch(action))

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
        getAllRoomsAction()
        .then((action) => dispatch(action))

    }, [rooms])
    
    return  isLoggedIn && <div className="d-flex flex-column">
                <div>{user.email}</div>
                <div>user ID: {user._id}</div>
                <div className="mt-5">
                    <CreateCustomRoom/>
                </div>
                <div>
                    <h3>All Rooms</h3>
                    <div className="d-flex flex-wrap">
                        {rooms?.map((room) => <div key={room._id} className="m-2"> <RoomPreview users={users} roomData= {room} id= {room._id} capacity = {room.capacity} language = {room.language} level = {room.level} creator = {room.creator} endpoint = {room.endpoint}/></div>)}
                    </div>
                   
                </div>
            </div>
}

export default HomePage;