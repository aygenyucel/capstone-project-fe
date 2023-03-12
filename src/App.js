import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SimplePeerRoom from './tests/SimplePeerRoom/SimplePeerRoom';
import PeerJSRoom from './tests/PeerJSRoom/PeerJSRoom';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RoomsPage from './pages/RoomsPage/RoomsPage';
import Home from './pages/HomePage/HomePage';
import CustomNavbar from './components/CustomNavbar/CustomNavbar';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <CustomNavbar/>
        <Routes>
          <Route path='/' element= {<Home/>}/>
          <Route path='/rooms' element= {<RoomsPage/>}/>
          <Route path='/simplePeerRoom/:id' element={<SimplePeerRoom/>}/>
          <Route path='/peerJSRoom' element= {<PeerJSRoom/>}/>
          <Route path='/chatRoom/:id' element={ <ChatRoom/>}/>
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
