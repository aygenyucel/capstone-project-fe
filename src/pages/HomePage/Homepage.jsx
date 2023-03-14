import { Button, Container } from "react-bootstrap";
import "./HomePage.css";
import { useEffect, useState } from "react";
import Typical from 'react-typical'
import CustomNavbar from './../../components/CustomNavbar/CustomNavbar';

const Home = () => {

    const [languages, setLanguages] = useState(["English",4000, "Chinese",4000, "Spanish",4000, "French", 4000,"Japanase",4000, "Italian",4000, "Korean",4000, "Russian",4000,"Arabic",4000, "Turkish",4000, "German",4000])
    const [newLanguage, setNewLanguage] = useState("")
    const [index, setIndex] = useState(0);
    
    
    useEffect(() => {
       

        const timer = () => {
            const randomIndex = Math.floor(Math.random() * languages.length);
            setIndex(randomIndex)
          };
          setInterval(timer, 8000);
          
          //cleanup function in order clear the interval timer
          //when the component unmounts
          return () => { clearInterval(timer); }
          
    }, [])
    
    return   <>
        <CustomNavbar/>
        <div className="homepage d-flex flex-column"> 
                <div className="homepage-div">
                    <Container>
                        <div className="main-container d-flex ">
                            
                            <div className="col-6 d-flex flex-column justify-content-center main-left">
                                <div className="d-flex flex-column main-header">
                                    <div>Start speaking</div>
                                    <Typical
                                        steps={languages}
                                        loop={Infinity}
                                        wrapper="p"
                                        className="main-header-language"
                                        /> 
                                    <div>now!</div>
                                </div>
                                
                            </div>
                            <div className="col-6  main-right d-flex justify-content-start aling-items-end">
                                <img className="home-img img-group-calling" src="/assets/group-calling.png" alt="group-calling" />
                            </div>
                        </div>
                    </Container>
                </div>
                <div>
                    <Container>
                        <div className="d-flex justify-content-center btn-div">
                            <div className="btn-div-left ">
                                <img className="arrow-svg" src="/assets/undraw_fun-arrow.svg" alt="arrow-svg" />
                                <Button className="main-btn get-started-btn">
                                    Get started
                                </Button>
                            </div>
                            <div>
                                <Button className="main-btn learn-more-btn">
                                    Learn more
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
                <div className="homepage-div homepage-div-bottom">
                    <Container>
                        <div className="d-flex">
                            <div className="col-6 bottom-img-div d-flex justify-content-center">
                                <img className="home-img bottom-img" src="/assets/around_the_world.png" alt="around-the-world" />
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-center  bottom-header">
                                <div className="d-flex bottom-header-1 mb-3 ">
                                No lessons, no waiting. 
                                </div>
                                <div className="d-flex  bottom-header-2 justify-content-end">
                                Find yourself a speaking opportunity
                                </div>

                                <div className="d-flex bottom-header-4 justify-content-end mb-3">
                                at anytime, anywhere!
                                </div>
                            <div className="d-flex  bottom-header-2 justify-content-end">
                            <Button className="discover-btn">DISCOVER</Button>
                            </div>
                            </div>

                        </div>
                    </Container>
                </div>
                
            </div>
        </>
}

export default Home;