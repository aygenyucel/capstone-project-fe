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
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const user = useSelector(state => state.profileReducer.data)
    const rooms = useSelector(state => state.roomsReducer.rooms)
    const users = useSelector(state => state.peersReducer.users)

    const [searchCapacity, setSearchCapacity] = useState(null)
    const [searchLanguage, setSearchLanguage] = useState(null)
    const [searchLevel, setSearchLevel] = useState(null);
    
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

    const onSubmitHandler = (e) => {
        e.preventDefault();
        //TODO: search room function
    }
    
    return  isLoggedIn && <div className="d-flex flex-column">
                <div>{user.email}</div>
                <div>user ID: {user._id}</div>
                <div>username: {user.username}</div>
                <div className="mt-5">
                    <CreateCustomRoom/>
                </div>
                <div>
                    <Form onSubmit={onSubmitHandler} className="d-flex justify-content-center align-items-center mt-3 mb-3">
                        <Form.Group className="me-2">
                            <Form.Select defaultValue={'DEFAULT'}   id="roomCapacity" onChange={(e) => setSearchCapacity(e.target.value)}>
                                 <option value="DEFAULT" disabled>Choose a room capacity</option>
                                <option   value= {2} >2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="me-2">
                            <Form.Select defaultValue={'DEFAULT'} id="roomLanguage" onChange={(e) => setSearchLanguage(e.target.value)}>
                                 <option value="DEFAULT" disabled>Choose a language</option>
                                <option  value="English" >English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Turkish">Turkish</option>
                                <option value="Russian">Russian</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="me-2">
                            
                            <Form.Select defaultValue={'DEFAULT'}  id="roomLevel" onChange={(e) => setSearchLevel(e.target.value)}>
                                <option value="DEFAULT" disabled>Choose a language level</option>
                                <option value="A1" >A1 - Beginner</option>
                                <option value="A2" >A2 - Elementary</option>
                                <option value="B1">B1 - Intermediate</option>
                                <option value="B2">B2 - Upper Intermediate</option>
                                <option value="C1">C1 - Advanced</option>
                                <option value="C2">C2 - Proficiency</option>
                                <option value="Native">Native Speaker</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="secondary" type="submit">
                            Search
                        </Button>
                    </Form>
                    
                        <h3>All Rooms</h3>
                        <div className="d-flex flex-wrap">
                            {rooms?.map((room) => <div key={room._id} className="m-2"> <RoomPreview users={users} roomData= {room} id= {room._id} capacity = {room.capacity} language = {room.language} level = {room.level} creator = {room.creator} endpoint = {room.endpoint}/></div>)}
                        </div>
                    

                   
                </div>
            </div>
}

export default HomePage;