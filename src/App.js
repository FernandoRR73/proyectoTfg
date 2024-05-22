import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


//componentes importados
import Navbar from "./components/Navbar/Navbar.jsx";
import DriverDetailPage from "./components/DriverDetailPage/DriverDetailPage.jsx";


//paginas iomportadas
import Home from './pages/Home.js';
import About from "./pages/About.js";
import PosicionesPilotos from "./pages/posiciones/PosicionesPiloto.js";
import PosicionesConstructores from "./pages/posiciones/PosicionesConstructores.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import ConstructorDetailPage from "./components/ConstructorDetailPage/ConstructorDetail.jsx";


function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/about" element={<About/>}></Route>
        <Route path="posiciones/pilotos" element={<PosicionesPilotos/>}></Route>
        <Route path="posiciones/constructores" element={<PosicionesConstructores/>}></Route>
        <Route path="/drivers/:driverId" element={<DriverDetailPage/>}/>
        <Route path="/constructor/:constructorId" element={<ConstructorDetailPage/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/Registro" element={<Registration/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;