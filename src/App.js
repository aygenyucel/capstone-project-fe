import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/Homepage.jsx';
import SimplePeerRoom from './tests/SimplePeerRoom/SimplePeerRoom';
import PeerJSRoom from './tests/PeerJSRoom/PeerJSRoom';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage/>}/>
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
