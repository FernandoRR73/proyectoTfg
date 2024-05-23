import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CircuitDetail = () => {
  const { circuitId } = useParams();
  const [circuit, setCircuit] = useState(null);

  useEffect(() => {
    const fetchCircuitData = async () => {
      try {
        const response = await fetch(`https://ergast.com/api/f1/circuits/${circuitId}.json`);
        const data = await response.json();
        setCircuit(data.MRData.CircuitTable.Circuits[0]);
      } catch (error) {
        console.error('Error fetching circuit data:', error);
      }
    };

    fetchCircuitData();
  }, [circuitId]);

  if (!circuit) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>{circuit.circuitName}</h2>
      <p><strong>Location:</strong> {circuit.Location.locality}, {circuit.Location.country}</p>
      <p><strong>Latitude:</strong> {circuit.Location.lat}</p>
      <p><strong>Longitude:</strong> {circuit.Location.long}</p>
      <p><a href={circuit.url} target="_blank" rel="noopener noreferrer">More Information</a></p>
    </div>
  );
};

export default CircuitDetail;
