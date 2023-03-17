import "./searchRoom.css"
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import languages from 'languages-data';
import Select from 'react-select';
import RoomPreview from './../RoomPreview/RoomPreview';
import { useSelector } from 'react-redux';


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

            const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms?${searchQuery}`, {method : "GET"})

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


    const onChangeCapacityHandler = (e) => {
        const capacity = e.target.value
        setCapacity(e.target.value);
        getSearchedRooms(capacity, language, level)
    }
    const onChangeLanguageHandler = (e) => {
        const language = e.target.value
        console.log("language changed! ", language)
        setLanguage(e.target.value);
        getSearchedRooms(capacity, language, level)
    }
    const onChangeLevelHandler = (e) => {
        const level =  e.target.value
        setLevel(e.target.value);
        getSearchedRooms(capacity, language, level)
    }

    return <>
                <Form onSubmit={onSubmitHandler} className="d-flex justify-content-center align-items-center mt-3 mb-3">
                        <Form.Group className="me-2">
                            <Form.Select defaultValue={'DEFAULT'}   id="roomCapacity" onChange={(e) => onChangeCapacityHandler(e)}>
                                 <option value="DEFAULT" disabled>Room capacity</option>
                                <option   value= {2} >2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="me-2">
                            <Form.Select defaultValue={'DEFAULT'} id="roomLanguage" onChange={(e) => onChangeLanguageHandler(e)}>
                                <option value="DEFAULT" disabled>
                                    Language
                                </option>
                                {languageOptions?.map((language) =>  <option   value= {language.value} >{language.value}</option>)}
                            </Form.Select>
                                {/* <Select className="select-language"
                                    defaultValue={language}
                                    placeholder= {language ? language : "Language" }
                                    value={language}
                                    onChange={handleChangeLanguage}
                                    options={languageOptions}
                                /> */}
                               
                        </Form.Group>
                        <Form.Group className="me-2">
                            
                            <Form.Select defaultValue={'DEFAULT'}  id="roomLevel" onChange={(e) => onChangeLevelHandler(e)}>
                                <option value="DEFAULT" disabled>Language level</option>
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
                </Form>
                <div className="search-results d-flex flex-column">
                    
                    {/* <h2>Search Results</h2> */}
                    {searchedRooms.map((room) => <RoomPreview key={room._id} roomData = {room}/>) }
                   
                    
                    
                </div>
             </>
}

export default SearchRoom;