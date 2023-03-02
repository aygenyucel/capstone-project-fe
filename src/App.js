import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PeerJSRoom from './components/PeerJSRoom/PeerJSRoom.jsx';
import HomePage from './components/HomePage/Homepage.jsx';
import SimplePeerRoom from './components/SimplePeerRoom/SimplePeerRoom.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/simplePeerRoom/:id' element={<SimplePeerRoom/>}/>
        <Route path='/peerJSRoom' element= {<PeerJSRoom/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
