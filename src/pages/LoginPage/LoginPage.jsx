import "./loginPage.css"
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { isLoggedInAction, loginAndGetTokenAction } from "../../redux/actions";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";


const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const JWTToken = localStorage.getItem("JWTToken")
    const userData = useSelector(state => state.profileReducer.data);

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser();
    }

    const loginUser = () => {
        return new Promise((resolve, reject) => {
            const user = {
                email: email,
                password: password
            }
            loginAndGetTokenAction(user)
            .then(({dispatchAction1, dispatchAction2}) =>{
                dispatch(dispatchAction1, dispatchAction2)
                
                window.location.reload()})
            .catch((error) => console.log(error))
        
        }) }

    useEffect(() => {
        
        //checking if user already logged in
        
        isLoggedInAction(userData, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                // console.log("yes its logged in")
                navigate("/rooms")
            } 
        })
        .catch(err => console.log(err))
    }, [])
    
    return <div className="login-page">
                <Container>
                    <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column login-div mt-5">
                        <div className="mb-3 login-page-header">LOGIN</div>
                        <Form onSubmit={handleSubmit}>
                            <div className="d-flex flex-column ">
                            <Form.Group className="mb-3 d-flex flex-column align-items-start " controlId="formBasicEmail">
                                <Form.Label className="login-label" >Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicPassword">
                                <Form.Label className="login-label">Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="login-btn">
                                Login
                            </Button>
                            <div className="d-flex justify-content-end mt-3 login-label">Not a member?<a href="/signup" className="ms-2 login-label-signup"> SIGNUP</a></div>
                            </div>
                        </Form>
                    </div>
                    </div>
                </Container>
            </div>

}
export default LoginPage
