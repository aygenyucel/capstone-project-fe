import { Button, Container } from "react-bootstrap";
import "./HomePage.css";
import { useEffect, useState } from "react";
import Typical from 'react-typical'

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
    
    return   <div className="homepage d-flex flex-column"> 
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
                            <div className="btn-div-left">
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
                            <div className="col-6 bottom-img-div d-flex flex-end">
                                <img className="bottom-img" src="/assets/around_the_world.png" alt="around-the-world" />
                            </div>
                            <div className="col-6 bottom-header">
                                fdssgs
                            </div>
                        </div>
                    </Container>
                </div>
                
            </div>
}

export default Home;