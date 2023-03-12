import "./customNavbar.css"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const CustomNavbar = () => {
    return  <div className="navbar-div">
              <Container>

      
                <div className="d-flex justify-content-between align-items-center">
                  <div className="navbar-left d-flex justify-content-center align-items-center">
                    <div className="navbar-logo d-flex justify-content-center align-items-center">
                      sipeaky
                    </div>
                  </div>
                  <div className="navbar-middle d-flex">
                    <div>Home</div>
                    <div>Chat rooms</div>
                    <div>Create a room</div>
                    <div>About Sipeaky</div>
                  </div>
                  <div className="navbar-right">
                    <div>Sign up</div>
                  </div>
                </div>
            </Container>
            </div>
}
export default CustomNavbar