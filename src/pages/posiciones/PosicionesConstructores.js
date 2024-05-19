// PosicionesConstructores.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConstructorCard from '../../components/PosicionesComponents/constructorCard/ConstructorCard';
import ApiConstructor from '../../components/ApiConstructor';
import ApiPiloto from '../../components/ApiPiloto';
import './PosicionesConstructores.css';

const PosicionesConstructores = () => {
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);

  const handleConstructorDataFetched = (data) => {
    setConstructorStandings(data);
  };

  const handleDriverDataFetched = (data) => {
    setDriverStandings(data);
  };

  // Combine constructor and driver data
  const combinedData = constructorStandings.map(constructor => ({
    ...constructor,
    drivers: driverStandings.filter(driver => driver.constructorId === constructor.constructorId)
  }));

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Tabla de Posiciones de Constructores</h1>
      <ApiConstructor onDataFetched={handleConstructorDataFetched} />
      <ApiPiloto onDataFetched={handleDriverDataFetched} />
      <div className="row">
        {combinedData.map((constructor, index) => (
          <div key={index} className={`col-md-6 col-lg-6 ${index % 2 !== 0 ? 'offset-top' : ''}`}>
            <ConstructorCard constructor={constructor} drivers={constructor.drivers} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosicionesConstructores;
