import "./searchRoom.css"
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from "react";

const SearchRoom = () => {
    const [searchCapacity, setSearchCapacity] = useState(null)
    const [searchLanguage, setSearchLanguage] = useState(null)
    const [searchLevel, setSearchLevel] = useState(null);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        //TODO: search room function
    }
    return <>
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
    </>
}

export default SearchRoom;