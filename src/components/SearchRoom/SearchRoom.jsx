import "./searchRoom.css"
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import languages from 'languages-data';
import Select from 'react-select';
import RoomPreview from './../RoomPreview/RoomPreview';
import { useSelector } from 'react-redux';
import {MdRefresh} from 'react-icons/md'


const SearchRoom = () => {
    const [capacity, setCapacity] = useState(null);
    const [language, setLanguage] = useState(null);
    const [level, setLevel] = useState(null);
    const [languageOptions, setLanguageOptions] = useState([])
    const [searchedRooms, setSearchedRooms] = useState([])
    const rooms = useSelector(state => state.roomsReducer.rooms);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        //TODO: search room function
    }

    useEffect(() => {
        // console.log(languagesData)
        const languagesData = languages.getAllLanguages()
        
        setLanguageOptions(languagesData.map((language ) =>  {
            return {value: language.name, label: language.name}}))
        console.log("xxx", languageOptions)
    }, [])

    

    const getSearchedRooms = async (capacity, language, level) => {
        let searchQuery = "";

            if(capacity) {
                searchQuery += `&capacity=${capacity}`
            }
            if(language) {
                searchQuery += `&language=${language}`
            }
            if(level) {
                searchQuery+= `&level=${level}`
            }

        try {

            const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/search?${searchQuery}`, {method : "GET"})

            if(response.ok) {
                const data = await response.json();
                console.log("searched rooms triggered!", data, searchQuery)
                setSearchedRooms(data)
                
            } else {
                console.log("oopsss, something went wrong :/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [isFormChanged, setIsFormChanged] = useState(false)

    const onChangeCapacityHandler = (e) => {
        const capacity = e.target.value
        setCapacity(e.target.value);
        getSearchedRooms(capacity, language, level)
        setIsFormChanged(true)
    }
    const onChangeLanguageHandler = (e) => {
        const language = e.target.value
        console.log("language changed! ", language)
        setLanguage(e.target.value);
        getSearchedRooms(capacity, language, level)
        setIsFormChanged(true)
    }
    const onChangeLevelHandler = (e) => {
        const level =  e.target.value
        setLevel(e.target.value);
        getSearchedRooms(capacity, language, level)
        setIsFormChanged(true)
    }

    const ref = React.useRef(null);
    const resetForm = () => {
        ref.current.reset()
        setSearchedRooms([])
        setIsFormChanged(false)
    }

    useEffect(() => {console.log("is form changed? ", isFormChanged)}, [isFormChanged])

    return <div className="search-room-div">
                <Form ref={ref} onSubmit={onSubmitHandler} className=" d-flex justify-content-center align-items-end mt-3 mb-3">
                        <Form.Group className="me-2 d-flex flex-column form-group">
                            
                            <div className="d-flex justify-content-start ms-1 mb-1">I want to speak</div>
                            <Form.Select defaultValue={'DEFAULT'} id="roomLanguage" onChange={(e) => onChangeLanguageHandler(e)}>
                                <option value="DEFAULT" disabled>
                                    Select Language
                                </option>
                                {languageOptions?.map((language) =>  <option   value= {language.value} >{language.value}</option>)}
                            </Form.Select>
                            
                        </Form.Group>
                        <Form.Group className="me-2 d-flex flex-column form-group">
                            <div className="d-flex justify-content-start ms-1 mb-1">Room capacity</div>
                            <Form.Select defaultValue={'DEFAULT'}   id="roomCapacity" onChange={(e) => onChangeCapacityHandler(e)}>
                                 <option value="DEFAULT" disabled>Select capacity</option>
                                <option value= {2} >2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="me-2 d-flex flex-column form-group">
                            <div className="d-flex justify-content-start ms-1 mb-1">My speaking level</div>
                            <Form.Select defaultValue={'DEFAULT'}  id="roomLevel" onChange={(e) => onChangeLevelHandler(e)}>
                                <option value="DEFAULT" disabled>Select level</option>
                                <option value="A1" >A1 - Beginner</option>
                                <option value="A2" >A2 - Elementary</option>
                                <option value="B1">B1 - Intermediate</option>
                                <option value="B2">B2 - Upper Intermediate</option>
                                <option value="C1">C1 - Advanced</option>
                                <option value="C2">C2 - Proficiency</option>
                                <option value="Native">Native Speaker</option>
                            </Form.Select>
                            
                        </Form.Group>
                        {/* <Button type="submit" onClick={getSearchedRooms}>Search</Button> */}
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            
                            <MdRefresh className="reset-form-icon mb-2 ms-2" onClick={resetForm}/>
                        </div>
                        
                </Form>
                
                {isFormChanged && 
                    <div className="search-results d-flex flex-wrap">
                        
                        { (searchedRooms.length === 0)
                        ? <div>No search results found. <span>Create your own?</span></div> 
                        : <div className="d-flex justify-content-center flex-wrap align-items-center"> 
                            {searchedRooms.map((room) =>
                                <div className="room-preview-div">
                                    <RoomPreview  className = {"search-preview"} key={room._id} roomData = {room}/>
                                </div>
                            ) }
                        </div>}
                    
                    </div>}
                
             </div>
}

export default SearchRoom;