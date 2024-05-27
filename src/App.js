// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from "./AuthContext.js";

// componentes importados
import Navbar from "./components/Navbar/Navbar.jsx";
import DriverDetailPage from "./components/DriverDetailPage/DriverDetailPage.jsx";
import Forums from "./components/Forum/Forums.jsx";
import Threads from "./components/Forum/Threads.jsx";
import ThreadMessages from "./components/Forum/ThreadMessages.jsx";

// páginas importadas
import Home from './pages/Home.js';
import About from "./pages/About.js";
import PosicionesPilotos from "./pages/posiciones/PosicionesPiloto.js";
import PosicionesConstructores from "./pages/posiciones/PosicionesConstructores.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import ConstructorDetailPage from "./components/ConstructorDetailPage/ConstructorDetail.jsx";
import RaceCalendar from "./components/RaceCalendar/RaceCalendar.jsx";
import CircuitDetail from "./components/CircuitDetail/CircuitDetail.jsx";
import UserProfile from "./pages/Profile.js";
import ForumPage from "./pages/forum/ForumPage.js";

// css formularios
import './Styles/Forms.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/> } />
          <Route path="/about" element={<About/>}></Route>
          <Route path="standings/drivers" element={<PosicionesPilotos/>}></Route>
          <Route path="standings/constructors" element={<PosicionesConstructores/>}></Route>
          <Route path="/drivers/:driverId" element={<DriverDetailPage/>}/>
          <Route path="/constructor/:constructorId" element={<ConstructorDetailPage/>}></Route>
          <Route path="/calendar"element={<RaceCalendar/>} ></Route>
          <Route path="/circuit/:circuitId" element={<CircuitDetail/>} />
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Registration/>}></Route>
          <Route path="/profile" element={<UserProfile/>}></Route>
          <Route path="/forum" element={<ForumPage/>}></Route>
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/:forumId" element={<Threads />} />
          <Route path="/threads/messages/:threadId" element={<ThreadMessages />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
