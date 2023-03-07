import CreateRoom from "../../components/CreateRoom.jsx";
import { useDispatch } from 'react-redux';
import { isLoggedInAction, resetStateAction } from "../../redux/actions/index.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import profileReducer from './../../redux/reducers/profileReducer';
import CreateCustomRoom from './../../components/CreateCustomRoom/CreateCustomRoom';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.profileReducer.data)
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // dispatch(resetStateAction());
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


    
    return  isLoggedIn && <div className="d-flex flex-column">
                <div>{user.email}</div>
                <div>Home Page</div>
                <CreateRoom/>
                <div className="mt-5">
                    <CreateCustomRoom/>
                </div>
            </div>
}

export default HomePage;