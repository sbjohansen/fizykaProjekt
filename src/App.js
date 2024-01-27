import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const gravityValues = {
  Merkury: 3.7,
  Wenus: 8.87,
  Ziemia: 9.81,
  Mars: 3.711,
  Jowisz: 24.79,
  Saturn: 10.44,
  Uran: 8.69,
  Neptun: 11.15,
};

function App() {
  const [length, setLength] = useState(2); // w metrach
  const [angle, setAngle] = useState(30); // w stopniach
  const [gravity, setGravity] = useState(9.81); // m/s^2
  const [airResistance, setAirResistance] = useState(0.05); // współczynnik oporu powietrza
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const timeStep = 0.1;
    let theta = (angle * Math.PI) / 180;
    let omega = 0;
    const stoppingAngle = (0.5 * Math.PI) / 180; // 0.5 stopnia
    let stopped = false;
    let step = 0;

    const points = [];

    while (!stopped) {
      const alpha = (-gravity / length) * Math.sin(theta) - airResistance * omega;
      omega += alpha * timeStep;
      theta += omega * timeStep;

      points.push({ time: step * timeStep, angle: (theta * 180) / Math.PI });

      if (Math.abs(theta) < stoppingAngle && Math.abs(omega) < 0.001) {
        stopped = true;
      }

      step++;
    }

    setDataPoints(points);
  }, [length, angle, gravity, airResistance]);

  const graphData = {
    labels: dataPoints.map((dp) => `${dp.time.toFixed(2)}s`),
    datasets: [
      {
        label: 'Kąt (stopnie)',
        data: dataPoints.map((dp) => dp.angle),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const graphOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Czas (s)', 
        },
      },
      y: {
        title: {
          display: true,
          text: 'Kąt (stopnie)', 
        },
      },
    },
  };

  return (
    <div>
      <h1>Symulacja Wahadła Fizycznego z Oporem Powietrza</h1>
      <div>
        <label>Długość liny (m): {length}</label>
        <input type='range' min='1' max='10' value={length} onChange={(e) => setLength(e.target.value)} />
      </div>
      <div>
        <label>Kąt początkowy (stopnie): {angle}</label>
        <input type='range' min='0' max='90' value={angle} onChange={(e) => setAngle(e.target.value)} />
      </div>
      <div>
        <label>Siła grawitacji: {gravity} m/s²</label>
        <select value={gravity} onChange={(e) => setGravity(e.target.value)}>
          {Object.entries(gravityValues).map(([planet, value]) => (
            <option key={planet} value={value}>
              {planet}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Współczynnik oporu powietrza: {airResistance}</label>
        <input type='range' min='0.01' max='0.1' step='0.01' value={airResistance} onChange={(e) => setAirResistance(e.target.value)} />
      </div>
      <Line data={graphData} options={graphOptions} />
    </div>
  );
}

export default App;
