import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImgPiloto from '../../components/PosicionesComponents/imgPiloto';

const DriverDetailPage = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [victories, setVictories] = useState(0);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://ergast.com/api/f1/drivers/${driverId}.xml`);
        const xmlString = await response.text();

        // Parsear XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Extraer detalles del piloto desde el XML
        const driverNode = xmlDoc.querySelector('Driver');
        const driverData = {
          name: driverNode.querySelector('GivenName').textContent + ' ' + driverNode.querySelector('FamilyName').textContent,
          nationality: driverNode.querySelector('Nationality').textContent,
          dateOfBirth: driverNode.querySelector('DateOfBirth').textContent,
          wikipediaUrl: driverNode.getAttribute('url'), // Obtener el atributo url del elemento Driver
        };

        // Actualiza el estado con los detalles del piloto
        setDriver(driverData);
      } catch (error) {
        console.error('Error fetching or parsing XML:', error);
      }
    };

    const fetchVictories = async () => {
      let totalVictories = 0;
      const driverFullName = driver ? driver.name : '';

      for (let year = 2000; year <= new Date().getFullYear(); year++) {
        try {
          const response = await fetch(`http://ergast.com/api/f1/${year}/results/1.json?limit=1000`);
          const data = await response.json();

          // Contar victorias
          const wins = data.MRData.RaceTable.Races.filter(race => {
            const winningDriver = race.Results[0].Driver;
            return `${winningDriver.givenName} ${winningDriver.familyName}` === driverFullName;
          }).length;
          totalVictories += wins;
        } catch (error) {
          console.error(`Error fetching or parsing data for year ${year}:`, error);
        }
      }

      setVictories(totalVictories);
    };

    fetchDriver();
    fetchVictories();
  }, [driverId, driver]);

  return (
    <div>
      <h2>Detalles del Piloto</h2>
      {driver && (
        <div>
          <ImgPiloto driverId={driverId} /> {/* Añadir imagen del piloto */}
          <p>Nombre: {driver.name}</p>
          <p>Nacionalidad: {driver.nationality}</p>
          <p>Fecha de Nacimiento: {driver.dateOfBirth}</p>
          <p>Victorias: {victories}</p> {/* Mostrar número de victorias */}
          <p>
            <a href={driver.wikipediaUrl} target="_blank" rel="noopener noreferrer">Biografía</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverDetailPage;
