// ConstructorDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeamLogo from '../PosicionesComponents/TeamLogo';
import TeamCar from '../PosicionesComponents/TeamCar';
import ImgPiloto from '../PosicionesComponents/ImgPiloto';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConstructorDetailPage = () => {
  const { constructorId } = useParams();
  const [constructor, setConstructor] = useState(null);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchConstructor = async () => {
      try {
        const response = await fetch(`http://ergast.com/api/f1/current/constructors/${constructorId}.json`);
        const data = await response.json();
        const constructorData = data.MRData.ConstructorTable.Constructors[0];
        setConstructor(constructorData);

        const responseDrivers = await fetch(`http://ergast.com/api/f1/current/constructors/${constructorId}/drivers.json`);
        const driversData = await responseDrivers.json();
        setDrivers(driversData.MRData.DriverTable.Drivers);
      } catch (error) {
        console.error('Error fetching constructor data:', error);
      }
    };

    fetchConstructor();
  }, [constructorId]);

  return (
    <div className="container constructor-detail-page">
      {constructor && (
        <>
          <div className="d-flex align-items-center mb-4">
            <h1 className="mr-3">{constructor.name}</h1>
            <TeamLogo constructorName={constructor.constructorId} className="constructor-logo-detail" />
          </div>
          <p><strong>Nationality:</strong> {constructor.nationality}</p>
          <p><strong>URL:</strong> <a href={constructor.url} target="_blank" rel="noopener noreferrer">{constructor.url}</a></p>
          <div className="car-image-detail">
            <TeamCar constructorName={constructor.constructorId} />
          </div>
          <h2 className="mt-5">Drivers</h2>
          <div className="drivers d-flex justify-content-around mb-3">
            {drivers.map((driver, index) => (
              <div key={index} className="driver text-center">
                <ImgPiloto driverId={driver.driverId} className="driver-photo" />
                <p className="mt-2">{driver.givenName} {driver.familyName}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConstructorDetailPage;
