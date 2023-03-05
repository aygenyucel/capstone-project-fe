import "./loginPage.css"
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from "react";


const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        //todo: add action for login
    }
    
    return <>
                <Container>
                    <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column login-div mt-5">
                        <div className="mb-3">LOGIN</div>
                        <Form onSubmit={handleSubmit}>
                            <div className="d-flex flex-column ">
                            <Form.Group className="mb-3 d-flex flex-column align-items-start " controlId="formBasicEmail">
                                <Form.Label >Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            <div className="d-flex justify-content-end mt-3">Not a member?<a href="/signup" className="ms-2"> SIGNUP</a></div>
                            </div>
                        </Form>
                    </div>
                    </div>
                </Container>
            </>

}
export default LoginPage
