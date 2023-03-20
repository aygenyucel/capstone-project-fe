/* eslint-disable react-hooks/exhaustive-deps */
import "./roomsPage.css";
import { useDispatch } from 'react-redux';
import { getAllRoomsAction, isLoggedInAction} from "../../redux/actions/index.js";
import { useEffect, useState } from "react";
import { resolvePath, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import CreateCustomRoom from '../../components/CreateCustomRoom/CreateCustomRoom';
import RoomPreview from "../../components/RoomPreview/RoomPreview.jsx";
import SearchRoom from '../../components/SearchRoom/SearchRoom.jsx';
import { Container } from "react-bootstrap";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { Button } from 'react-bootstrap';
import { useInfiniteScroll } from "infinite-scroll-hook";
import {GrFormNext, GrFormPrevious} from "react-icons/gr"


const RoomsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const user = useSelector(state => state.profileReducer.data)
    const rooms = useSelector(state => state.roomsReducer.rooms)
    const users = useSelector(state => state.peersReducer.users)

    
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(4)
    const [pageNumber, setPageNumber] = useState(0)
    const [roomsPaginated, setRoomsPaginated] = useState([])
    useEffect(() => {
        // dispatch(resetPeersStateAction());
        // dispatch(resetRoomsStateAction());
        
        getAllRoomsAction()
        .then((action) => dispatch(action))

        console.log("user", user, "jwt: ", JWTToken)
        isLoggedInAction(user, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                setIsLoggedIn(true)
                console.log("yes its logged in")
                console.log("roomsss", rooms)
            } else {
                navigate("/login")
            }
        })
        .catch(err => console.log(err))

        getRoomsWithPagination(pageNumber*(skip+3),limit)
    }, [])

    
    useEffect(() => {
        getAllRoomsAction()
        .then((action) => dispatch(action))

    }, [rooms])

    const getRoomsWithPagination = async(skip,limit) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms?skip=${skip}&limit=${limit}`)
            console.log("xxxxxxxxx", skip, "xxxxxxxxx", limit)
            if(response.ok) {
                const data = await response.json();
                setRoomsPaginated(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [totalPages, setTotalPages] = useState(Math.ceil(rooms.length/limit))
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(3);
    const [currentPage, setCurrentPage] = useState(0);
    const [isPageClicked, setIsPageClicked] = useState(false);
    const changePage = (e) => {
        e.preventDefault()
        const newPageNumber = e.currentTarget.getAttribute('value')
        setCurrentPage(e.currentTarget.getAttribute('value'))
        setPageNumber(newPageNumber)
        console.log(newPageNumber, "#######")
        const newSkip = newPageNumber*3
        console.log("newPageNumber", newPageNumber, "newSkip", newSkip)
        
        getRoomsWithPagination(newSkip, limit)
        setStartIndex(startIndex)
        setEndIndex(endIndex)
    }

    const prevClick = () => {
        if(startIndex > 0){
            setStartIndex(startIndex-1);
            setEndIndex(endIndex-1)

            const newPageNumber = Math.floor(currentPage)-1
            setCurrentPage(newPageNumber)
            setPageNumber(newPageNumber)
            const newSkip = newPageNumber*3
            getRoomsWithPagination(newSkip, limit)
        }
    }

    const [totalPagesArray, setTotalPagesArray] = useState([...Array(totalPages).keys()].slice(startIndex, endIndex))

    const nextClick = () => {
        if(endIndex <= totalPages){
            setStartIndex(startIndex+1);
            setEndIndex(endIndex+1)

            const newPageNumber = Math.floor(currentPage)+1
            setCurrentPage(newPageNumber)
            setPageNumber(newPageNumber)
            const newSkip = newPageNumber*3
            getRoomsWithPagination(newSkip, limit)
        }
    }

    useEffect(() => {
        setTotalPagesArray([...Array(totalPages).keys()].slice(startIndex, endIndex))
        console.log(totalPagesArray)
    }, [startIndex, endIndex, pageNumber])


    return  isLoggedIn && 
            <>
            <CustomNavbar/> 
            <div className=" roomspage d-flex flex-column ">
                <div className="create-room-div">
                    <CreateCustomRoom/>
                </div>
                <div className="roomspage-main d-flex flex-column justify-content-center align-items-center">
                        <div className="create-room-div">
                            <div className="search-room-div">
                                <SearchRoom/>
                            </div>
                            {/* <div>
                                <Button onClick={showYourRooms}>Your rooms</Button>
                                <div>{isYourRoomsClicked ? rooms.map(room => room.creator === user._id &&
                                    <div key={room._id} className="m-2"> 
                                        <RoomPreview roomData= {room} />
                                    </div>) : <div>nothing to show</div>}</div>
                            </div> */}
                        </div>
                        <div className="rooms-list d-flex flex-column justify-content-center align-items-center" >
                            {/* <SearchRoom/> */}
                            <div className="d-flex justify-content-center flex-wrap">
                                {roomsPaginated?.map((room) => 
                                    <div key={room._id} className="m-2"> 
                                        <RoomPreview roomData= {room} />
                                    </div>)}
                            
                            </div>
                            
                        </div>
                        <div className="rooms-pages d-flex justify-content-between align-items-center">
                                {(startIndex > 0)? <div> <GrFormPrevious onClick={prevClick} className="prev-page-btn"/> </div>: <div> <GrFormPrevious className="prev-page-btn invisible"/> </div>}
                                {totalPagesArray.map((i) => 
                                    <div key = {i} onClick={changePage} value={i} className={`page-number ${Math.floor(currentPage) === i ? "page-number-active": "page-not-active"}`}>{i+1}</div>
                                )}
                                {(endIndex +1 <= totalPages ) ? <GrFormNext value={Math.floor(currentPage)+1} onClick={nextClick} className="next-page-btn"/>: <GrFormNext className="invisible"/>}
                        </div>
                </div>
            </div>
            </>
}

export default RoomsPage;