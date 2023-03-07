import "./createCustomRoom.css"
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
const CreateCustomRoom = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [capacity, setCapacity] = useState(2);
    const [language, setLanguage] = useState("English");
    const [level, setLevel] = useState("A1");
    const [userID, setUserID] = useState("");

    const userData =  useSelector(state => state.profileReducer.data);
    

    const handleSubmit = () => {
        console.log("create room form submitted!!!")
        createNewRoom().then(() => handleClose());
    }

    const createNewRoom = () => {
        return new Promise (async (resolve, reject) => {

        
        const newRoom = {
            capacity: capacity,
            language: language,
            level: level,
            users:[userID]
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
                resolve(data)
                //TODO: dispatch new data to rooms reducer

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
                            <Form.Label htmlFor="roomCapacity">Room capacity</Form.Label>
                            <Form.Select id="roomCapacity" onChange={e => setCapacity(e.target.value)}>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="roomLanguage">Language</Form.Label>
                            <Form.Select id="roomLanguage" onChange={e => setLanguage(e.target.value)}>
                                <option value="English">English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Turkish">Turkish</option>
                                <option value="Russian">Russian</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="roomLevel">Language Level</Form.Label>
                            <Form.Select id="roomLevel" onChange={e => setLevel(e.target.value)}>
                                <option value="A1">A1 - Beginner</option>
                                <option value="A2">A2 - Elementary</option>
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