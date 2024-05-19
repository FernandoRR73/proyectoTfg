// Posiciones.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Posiciones.css';
import TeamLogo from '../../components/PosicionesComponents/TeamLogo';
import DorsalPiloto from '../../components/PosicionesComponents/DorsalPiloto';

const Posiciones = () => {
  const [driverStandings, setDriverStandings] = useState([]);
  const tbodyRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://ergast.com/api/f1/current/driverStandings');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDocument = parser.parseFromString(xmlText, 'text/xml');

        // Aquí puedes acceder a los elementos XML y extraer los datos necesarios
        const driverStandingsArray = Array.from(xmlDocument.getElementsByTagName('DriverStanding')).map(driverStanding => ({
          position: driverStanding.getAttribute('position'),
          points: driverStanding.getAttribute('points'),
          wins: driverStanding.getAttribute('wins'),
          driverId: driverStanding.getElementsByTagName('Driver')[0].getAttribute('driverId'),
          givenName: driverStanding.getElementsByTagName('GivenName')[0].textContent,
          familyName: driverStanding.getElementsByTagName('FamilyName')[0].textContent,
          constructor: driverStanding.getElementsByTagName('Constructor')[0].getAttribute('constructorId'),
          constructorName: driverStanding.getElementsByTagName('Name')[0].textContent
        }));

        setDriverStandings(driverStandingsArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Tabla de Posiciones</h1>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Posición</th>
            <th>Piloto</th>
            <th>Constructor</th>
            <th>Puntos</th>
            <th>Victorias</th>
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {driverStandings.map((driver, index) => (
            <tr key={index}>
              <td>{driver.position}</td>
              <td>
                <Link to={`/drivers/${driver.driverId}`}>
                  {driver.givenName} {driver.familyName}
                </Link>
                <DorsalPiloto driverId={driver.driverId} />
              </td>
              <td className="constructores">
                <TeamLogo constructorName={driver.constructor} />
              </td>
              <td>{driver.points}</td>
              <td>{driver.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posiciones;
