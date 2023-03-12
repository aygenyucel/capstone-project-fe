/* eslint-disable react-hooks/exhaustive-deps */
import "./createCustomRoom.css"
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewRoomAction } from "../../redux/actions";
import { v1 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';
import languages from 'languages-data';
import Select from 'react-select';



const CreateCustomRoom = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const userData =  useSelector(state => state.profileReducer.data);

    const [capacity, setCapacity] = useState(2);
    const [language, setLanguage] = useState("English");
    const [level, setLevel] = useState("B1");
    const [userID, setUserID] = useState(null);
    const [endpoint] = useState("") //random room link created by UUID

    const [languageOptions, setLanguageOptions] = useState("")
   


    const handleSubmit = (e) => {
        e.preventDefault()
        
        createNewRoom()
        .then(({data, roomEndpoint, roomID}) => {
            dispatch(addNewRoomAction(data))
            console.log("ddddddd", data, roomEndpoint, roomID)
            navigate(`/chatroom/${roomEndpoint}`, {state: {user: userData, roomID: roomID}})
        })
        .catch((err) => {console.log(err)});
    }



    //TODO: when user create a new room, update the user info and save the roomid inside that user object
    
    useEffect(() => {
        // console.log(languagesData)
        const languagesData = languages.getAllLanguages()
        
        setLanguageOptions(languagesData.map((language ) =>  {
            return {value: language.name, label: language.name}}))
        console.log("xxx", languageOptions)
    }, [])
    const createNewRoom = () => {
        return new Promise (async (resolve, reject) => {
            const randomEndpoint = uuid()
            const newRoom = {
                capacity: capacity,
                language: language,
                level: level,
                users:[],
                creator: `${userID}`,
                endpoint: randomEndpoint
                
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
                    const roomEndpoint = data.endpoint
                    const roomID = data._id
                    resolve({data, roomEndpoint, roomID})

                } else {
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

    const  handleChangeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage.value)
        console.log("language selected: ", language)
      };

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
                            <Form.Label>Select the room capacity</Form.Label>
                            <Form.Select defaultValue={2}   id="roomCapacity" onChange={e => setCapacity(e.target.value)}>
                                <option value= {2} >2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                                <Form.Label>Select the language</Form.Label>
                                <Select className="select-language"
                                    defaultValue={"English"}
                                    placeholder= {language ? language : "English" }
                                    value={language}
                                    onChange={handleChangeLanguage}
                                    options={languageOptions}
                                />
                               
                        </Form.Group>
                        <Form.Group className="mb-3">
                            
                            <Form.Label>Select Language level</Form.Label>
                            <Form.Select placeholder="B1 - Intermediate"  defaultValue={'B1'}  id="roomLevel" onChange={e => setLevel(e.target.value)}>
                                {/* <option value="DEFAULT">Choose a language level</option> */}
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

export default CreateCustomRoom;