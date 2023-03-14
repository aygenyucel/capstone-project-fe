import { Row, Container, Col } from 'react-bootstrap';
import "./chatRoomDesign.css"
import {AiOutlineAudio, AiFillAudio} from 'react-icons/ai'
import {MdOutlineCallEnd} from 'react-icons/md'
import {BsCameraVideoOff, BsCameraVideo} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {VscUnmute, VscMute} from 'react-icons/vsc'


const ChatRoomDesign = () => {
    return (
                <div className='d-flex flex-row chatRoom-div'>
                            <div className='left-sidebar'>
                                sdjkfhsdjfs
                            </div>
                            <div className=' main-area'>
                                <div className='main-top d-flex align-items-center'>
                                    <div className='main-top-language'>English</div>
                                    <div className='main-top-level'>B1</div>
                                </div>
                                <div className='main-bottom d-flex'>
                                    <div className='video-area d-flex flex-column justify-content-between'>
                                        <div className='video-area-header d-flex'>
                                            <div>copylink</div>
                                            <div>invite</div>
                                        </div>
                                        <div className='video-area-player'>
                                            <div className='video-area-player-frame d-flex flex-column align-items-center justify-content-center'>
                                                <Container className='d-flex flex-column justify-content-center'>
                                                    <Row>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>
                                                            </div>
                                                        </Col>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col>
                                                        <Col sm={6}> 
                                                            <div className='position-relative'>
                                                                <div className='video-player'>fsdf</div>
                                                                <div className='video-username'>username</div>

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                                
                                                
                                            </div>
                                        </div>
                                        <div className='video-area-footer d-flex justify-content-center align-items-center'>
                                            <div className='chat-btns mute-btn d-flex justify-content-center align-items-center'>
                                                <VscUnmute/>
                                                {/* <VscMute/> */}
                                            </div>
                                            <div className='chat-btns audio-btn d-flex justify-content-center align-items-center'>
                                                <AiOutlineAudio/>
                                                {/* <AiFillAudio/> */}
                                            </div>
                                            <div className=' end-call-btn d-flex justify-content-center align-items-center'>
                                                <MdOutlineCallEnd/>
                                            </div>
                                            <div className='chat-btns chat-btns camera-btn d-flex justify-content-center align-items-center'>
                                                <BsCameraVideo />
                                                {/* <BsCameraVideoOff /> */}
                                            </div>
                                            <div className='chat-btns settings-btn d-flex justify-content-center align-items-center'>
                                                <FiSettings/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='chat-area'>
                                        chat area
                                    </div>
                                </div>
                            </div>
                    </div>
            )
}

export default ChatRoomDesign;