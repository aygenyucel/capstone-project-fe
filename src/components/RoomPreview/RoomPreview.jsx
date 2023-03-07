import "./RoomPreview.css"
const RoomPreview = (props) => {

    return (<div className="d-flex flex-column room-preview-div">
        <div className="d-flex">
                    <div>room id: </div>
                    <div>{props.id}</div>
                </div>
                <div className="d-flex">
                    <div>room capacity: </div>
                    <div>{props.capacity}</div>
                </div>
                <div className="d-flex">
                    <div>Language: </div>
                    <div>{props.language}</div>
                </div>
                <div className="d-flex">
                    <div>level: </div>
                    <div>{props.level}</div>
                </div>
                <div className="d-flex">
                    <div>creator: </div>
                    <div>{props.creator}</div>
                </div>
            </div>)
}

export default RoomPreview;