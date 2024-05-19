import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DriverDetailPage = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://ergast.com/api/f1/drivers/${driverId}.xml`);
        const xmlString = await response.text();

        // Parsear XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // extraer detalles del piloto desde el XML
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

    fetchDriver();
  }, [driverId]);


  console.log(driver);

  return (
    <div>
      <h2>Driver Details</h2>
      {driver && (
        <div>
          <p>Name: {driver.name}</p>
          <p>Nationality: {driver.nationality}</p>
          <p>Date of Birth: {driver.dateOfBirth}</p>
            <p>
              <a href={driver.wikipediaUrl} target="_blank" rel="noopener noreferrer"><p>Biografia</p></a>
            </p>
        </div>
      )}
    </div>
  );
};
export default DriverDetailPage;