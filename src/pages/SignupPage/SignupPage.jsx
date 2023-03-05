import { Button, Container, Form } from "react-bootstrap"
import "./signupPage.css"
import { useState } from 'react';


const LoginPage = (props) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        //TODO: add actions for signup and redirect the user if allowed
    }

    return <>
                <Container>
                    <div className="d-flex justify-content-center">

                    <div className="d-flex flex-column signup-div mt-5">
                        <div className="mb-3">SIGN UP</div>
                        <Form onSubmit={handleSubmit} >
                            <div className="d-flex flex-column ">
                            <Form.Group className="mb-3 d-flex flex-column align-items-start " controlId="formBasicEmail">
                                <Form.Label >Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicEmail">
                                <Form.Label>User name</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
                            </Form.Group>  
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Sign up
                            </Button>
                            <div className="d-flex justify-content-end mt-3">Already a user?<a href="/login" className="ms-2"> LOGIN</a></div>
                            </div>
                        </Form>
                    </div>
                    </div>
                    
                </Container>
            </>

} 

export default LoginPage;