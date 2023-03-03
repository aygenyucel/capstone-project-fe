import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/Homepage.jsx';
import SimplePeerRoom from './tests/SimplePeerRoom/SimplePeerRoom';
import PeerJSRoom from './tests/PeerJSRoom/PeerJSRoom';
import PeerJSGroupRoom from './pages/PeerJSGroupRoom/PeerJSGroupRoom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/simplePeerRoom/:id' element={<SimplePeerRoom/>}/>
        <Route path='/peerJSRoom' element= {<PeerJSRoom/>}/>
        <Route path='/peerJSGroupRoom/:id' element={ <PeerJSGroupRoom/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
