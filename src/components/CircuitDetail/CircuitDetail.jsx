import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircuitMap from './CircuitMap'; // Importa el componente CircuitMap
import 'bootstrap/dist/css/bootstrap.min.css';
import './CircuitDetail.css'; // Asegúrate de tener este archivo CSS para los estilos personalizados

const CircuitDetail = () => {
  const { circuitId } = useParams();
  const [circuit, setCircuit] = useState(null);
  const [circuitDetails, setCircuitDetails] = useState(null);
  const [raceResults, setRaceResults] = useState(null);
  const [gpNumber, setGpNumber] = useState(null);

  useEffect(() => {
    const fetchCircuitData = async () => {
      try {
        const response = await fetch(`https://ergast.com/api/f1/current/circuits/${circuitId}.xml`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDocument = parser.parseFromString(xmlText, 'application/xml');

        const circuitData = xmlDocument.getElementsByTagName('Circuit')[0];
        const locationData = circuitData.getElementsByTagName('Location')[0];

        setCircuit({
          circuitName: circuitData.getElementsByTagName('CircuitName')[0].textContent,
          locality: locationData.getElementsByTagName('Locality')[0].textContent,
          country: locationData.getElementsByTagName('Country')[0].textContent,
          url: circuitData.getAttribute('url')
        });
      } catch (error) {
        console.error('Error fetching circuit data:', error);
      }
    };

    const fetchCircuitDetails = async () => {
      try {
        const response = await fetch('/circuitDetails.json');
        const data = await response.json();
        setCircuitDetails(data[circuitId]);
      } catch (error) {
        console.error('Error fetching circuit details:', error);
      }
    };

    const fetchGpNumber = async () => {
      try {
        const response = await fetch('https://ergast.com/api/f1/current.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDocument = parser.parseFromString(xmlText, 'application/xml');

        const race = Array.from(xmlDocument.getElementsByTagName('Race')).find(
          race => race.getElementsByTagName('Circuit')[0].getAttribute('circuitId') === circuitId
        );

        if (race) {
          setGpNumber(race.getAttribute('round'));
        }
      } catch (error) {
        console.error('Error fetching GP number:', error);
      }
    };

    fetchCircuitData();
    fetchCircuitDetails();
    fetchGpNumber();
  }, [circuitId]);

  useEffect(() => {
    const fetchRaceResults = async () => {
      if (gpNumber) {
        try {
          const response = await fetch(`https://ergast.com/api/f1/2024/${gpNumber}/results.xml`);
          const xmlText = await response.text();
          const parser = new DOMParser();
          const xmlDocument = parser.parseFromString(xmlText, 'application/xml');

          const results = Array.from(xmlDocument.getElementsByTagName('Result')).map(result => ({
            position: result.getAttribute('position'),
            number: result.getAttribute('number'),
            driverId: result.getElementsByTagName('Driver')[0].getAttribute('driverId'),
            givenName: result.getElementsByTagName('GivenName')[0].textContent,
            familyName: result.getElementsByTagName('FamilyName')[0].textContent,
            constructorName: result.getElementsByTagName('Constructor')[0].getElementsByTagName('Name')[0].textContent,
            time: result.getElementsByTagName('Time')[0] ? result.getElementsByTagName('Time')[0].textContent : 'N/A',
            points: result.getAttribute('points'),
            fastestLap: result.getElementsByTagName('FastestLap')[0]
              ? result.getElementsByTagName('FastestLap')[0].getElementsByTagName('Time')[0].textContent
              : 'N/A'
          }));

          if (results.length > 0) {
            setRaceResults(results);
          }
        } catch (error) {
          console.error('Error fetching race results:', error);
        }
      }
    };

    fetchRaceResults();
  }, [gpNumber]);

  if (!circuit || !circuitDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container circuit-detail">
      <h2>{circuit.circuitName}</h2>
      <div className="row align-items-stretch">
        <div className="col-md-6 d-flex flex-column">
          <CircuitMap circuitId={circuitId} className="flex-grow-1" />
        </div>
        <div className="col-md-6 d-flex flex-column">
          <div className="circuit-details flex-grow-1">
            <h3>Details</h3>
            <p><strong>Location:</strong> {circuit.locality}, {circuit.country}</p>
            <p><strong>Right Turns:</strong> {circuitDetails.rightTurns}</p>
            <p><strong>Left Turns:</strong> {circuitDetails.leftTurns}</p>
            <p><strong>DRS Zones:</strong> {circuitDetails.drsZones}</p>
            <p><a href={circuit.url} target="_blank" rel="noopener noreferrer">More Information</a></p>
          </div>
        </div>
      </div>
      {raceResults && (
        <div className="race-results">
          <h3>Race Results</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Position</th>
                <th>Number</th>
                <th>Driver</th>
                <th>Constructor</th>
                <th>Time</th>
                <th>Fastest Lap</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {raceResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.position}</td>
                  <td>{result.number}</td>
                  <td>{result.givenName} {result.familyName}</td>
                  <td>{result.constructorName}</td>
                  <td>{index < 10 ? result.time : ''}</td>
                  <td>{result.fastestLap}</td>
                  <td>{result.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CircuitDetail;
