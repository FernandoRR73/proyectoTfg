// ConstructorCard.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './constructorCard.css';
import TeamLogo from '../TeamLogo';
import ImgPiloto from '../ImgPiloto';
import TeamCar from '../TeamCar'; // Importar el nuevo componente

const ConstructorCard = ({ constructor, drivers }) => {
  return (
    <div className="constructor-card card mb-3">
      <div className="card-header d-flex justify-content-between">
        <div className="position">Posición: {constructor.position}</div>
        <div className="points">Puntos: {constructor.points}</div>
      </div>
      <div className="card-body">
        <div className="card-title d-flex justify-content-between align-items-center">
          <h5 className="constructor-name">{constructor.name}</h5>
          <TeamLogo constructorName={constructor.constructorId} />
        </div>
        <div className="card-text">
          <div className="drivers d-flex justify-content-around">
            {drivers.map(driver => (
              <div key={driver.driverId} className="driver text-center">
                <ImgPiloto driverId={driver.driverId} />
                <p>{driver.givenName} {driver.familyName}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card-image mt-3">
          <TeamCar constructorName={constructor.constructorId} />
        </div>
      </div>
    </div>
  );
};

export default ConstructorCard;
