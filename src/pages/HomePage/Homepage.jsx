import CreateRoom from "../../components/CreateRoom.jsx";
import { useDispatch } from 'react-redux';
import { resetStateAction } from "../../redux/actions/index.js";
import { useEffect } from "react";

const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetStateAction());
    }, [])
    
    return <div className="d-flex flex-column">
                <div>Home Page</div>
                <CreateRoom/>
            </div>
}

export default HomePage;