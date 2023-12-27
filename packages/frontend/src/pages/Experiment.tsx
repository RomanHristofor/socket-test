import { useEffect, useState } from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { useExperiment } from '../api/provider';
import './Style.css'

interface Experiment {
  sensorId: string;
  value: number;
  timestamp: string;
}

interface SensorData {
  [sensorId: string]: Experiment[];
}

enum Status {
  Start = 'Start',
  Stop = 'Stop',
}

function Experiment() {
  const { toggle, dataset } = useExperiment();
  const [status, setStatus] = useState(Status.Start)
  const [data, setData] = useState<SensorData>({});
  const colors = ['red', 'blue'];

  const toggleBtn = () => {
    setStatus(status === Status.Start ? Status.Stop : Status.Start)
    toggle()
  }

  useEffect(() => {
    if (dataset.length) {
      const filtered = dataset
        .map((payload) => payload?.sensorId)
        .filter(Boolean);

      const data = filtered.reduce((acc, id) => {
        // @ts-expect-error
        acc[id] = dataset.filter(({ sensorId }) => id === sensorId);
        return acc;
      }, {});

      setData(data)
    }
  }, [dataset])

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8," 
      + Object.entries(data).map(([sensorId, dataPoints]) => 
          dataPoints.map(point => `${sensorId},${point.timestamp},${point.value}`).join("\n")
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button onClick={toggleBtn}>{status}</button>
      {Boolean(dataset.length) && <button onClick={downloadCSV}>Download CSV</button>}
      <div className="container">
        <VictoryChart domainPadding={20} containerComponent={<VictoryVoronoiContainer />}>
          <VictoryAxis 
            dependentAxis 
            style={{ 
              tickLabels: { fontSize: 8, textAnchor: 'end' }
            }} 
          />
          <VictoryAxis style={{ tickLabels: { fontSize: 8 } }} />
            {Object.keys(data).map((sensorId, idx) => (
              <VictoryLine
                key={sensorId}
                data={data[sensorId]}
                x="timestamp"
                y="value"
                style={{ data: { stroke: colors[idx % colors.length] } }}
                labels={({ item }: { item: Experiment }) => `${item?.value}`}
                labelComponent={<VictoryTooltip />}
              />
            ))}
        </VictoryChart>
        <div className="table">
          <div className="row header">
            <div className="cell">ID</div>
            <div className="cell">Time</div>
            <div className="cell">Value</div>
          </div>
          {dataset.map((item, index) => (
            <div className="row" key={index}>
              <div className="cell">{item?.sensorId}</div>
              <div className="cell">{item?.timestamp}</div>
              <div className="cell">{item?.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Experiment
  