import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatRoom from './components/ChatRoom/ChatRoom.jsx';
import HomePage from './components/HomePage/Homepage.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<ChatRoom/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
