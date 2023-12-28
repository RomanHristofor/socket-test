import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import { useExperiment } from "../api/provider";
import "./Style.css";

interface Experiment {
  sensorId: string;
  value: number;
  timestamp: string;
}

interface SensorData {
  [sensorId: string]: Experiment[];
}

enum Status {
  Start = "Start",
  Stop = "Stop",
}

const options = {
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        tooltipFormat: "yyyy-MM-dd",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Value",
      },
    },
  },
};

function Experiment() {
  const { toggle, dataset, status } = useExperiment();
  const [_status, setStatus] = useState(status || Status.Start);
  const [data, setData] = useState<SensorData>({});
  const colors = ["red", "blue"];

  const toggleBtn = () => {
    setStatus(_status === Status.Start ? Status.Stop : Status.Start);
    toggle();
  };

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

      setData(data);
    }
  }, [dataset]);

  const chartData = {
    labels: Object.keys(data).flatMap((sensorId) =>
      data[sensorId].map((d) => d.timestamp)
    ),
    datasets: Object.keys(data).map((sensorId, idx) => ({
      label: `sensor: ${sensorId}`,
      data: data[sensorId].map((d) => ({ x: d.timestamp, y: d.value })),
      borderColor: colors[idx],
      fill: false,
    })),
  };

  const downloadCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      Object.entries(data)
        .map(([sensorId, dataPoints]) =>
          dataPoints
            .map((point) => `${sensorId},${point.timestamp},${point.value}`)
            .join("\n")
        )
        .join("\n");

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
      <button onClick={toggleBtn}>{_status}</button>
      {Boolean(dataset.length) && (
        <button onClick={downloadCSV}>Download CSV</button>
      )}
      <div className="container">
        <Line
          data={chartData}
          // @ts-expect-error
          options={options}
        />
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

export default Experiment;
