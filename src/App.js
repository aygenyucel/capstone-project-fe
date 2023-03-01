import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Room from './components/Room/Room.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<Room/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
