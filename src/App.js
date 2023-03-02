import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Room from './components/Room/Room.jsx';
import HomePage from './components/HomePage/Homepage.jsx';
import SimplePeer from 'simple-peer';
import SimplePeerRoom from './Simple-Peer-Room/SimplePeerRoom.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/groupChatRoom/:id' element={<SimplePeerRoom/>}/>
        <Route path='/room' element= {<Room/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
