import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Room from './components/Room/Room.jsx';
import GroupChatRoom from './GroupChatRoom/GroupChatRoom.jsx';
import HomePage from './components/HomePage/Homepage.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/groupChatRoom/:id' element={<GroupChatRoom/>}/>
        <Route path='/room' element= {<Room/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
