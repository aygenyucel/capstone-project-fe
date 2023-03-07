import "./createCustomRoom.css"
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { useState, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewRoomAction } from "../../redux/actions";
import roomsReducer from './../../redux/reducers/roomsReducer';
import { ADD_NEW_ROOM } from './../../redux/actions/index';
const CreateCustomRoom = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const userData =  useSelector(state => state.profileReducer.data);
    const roomsData = useSelector(state => state.roomsReducer.rooms)

    const [capacity, setCapacity] = useState("");
    const [language, setLanguage] = useState("");
    const [level, setLevel] = useState("");
    const [userID, setUserID] = useState(null);


    const dispatch = useDispatch();
    const [currentRoomsReducer, dispatchRoomsReducer] = useReducer(roomsReducer, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("create room form submitted!!!")
        createNewRoom()
        .then((data) => {
            console.log("xxxxxxx", data)
            dispatch(addNewRoomAction(data))
        }).catch((err) => {console.log(err)});
    }
    
    useEffect(() => {
        console.log("roomsData:", roomsData)
    }, [roomsData])
    
    
    const createNewRoom = () => {
        return new Promise (async (resolve, reject) => {
            const newRoom = {
                capacity: capacity,
                language: language,
                level: level,
                users:[userID],
                creator: `${userID}`
            }
            const options = {
                method: "POST",
                body: JSON.stringify(newRoom),
                headers:{
                    "Content-Type": "application/json"
                }
            }
            
        
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms`, options)
                
                if(response.ok) {
                    const data = await response.json();
                    
                    console.log("new room data", data)
                    
                    //TODO: dispatch new data to rooms reducer
                    
                    resolve(data)

                } else{
                    console.log("opssssss error fetching data")
                }
                
            } catch (error) {
                console.log(error)
                reject(error)
            }
    })
    }

    useEffect(() => {
        setUserID(userData._id)
    }, [])

    return <>
        <Container>
            <div className="create-custom-room">
            <Button variant="primary" onClick={handleShow}>
                Create Your Custom Room 
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Custom Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Select defaultValue={'DEFAULT'}   id="roomCapacity" onChange={e => setCapacity(e.target.value)}>
                                 <option value="DEFAULT" disabled>Choose a room capacity</option>
                                <option   value= {2} >2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Select defaultValue={'DEFAULT'} id="roomLanguage" onChange={e => setLanguage(e.target.value)}>
                                 <option value="DEFAULT" disabled>Choose a language</option>
                                <option  value="English" >English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Turkish">Turkish</option>
                                <option value="Russian">Russian</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            
                            <Form.Select defaultValue={'DEFAULT'}  id="roomLevel" onChange={e => setLevel(e.target.value)}>
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
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </Container>
    </>
} 

export default CreateCustomRoom