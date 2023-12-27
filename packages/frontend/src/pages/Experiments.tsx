import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { useExperiment } from '../api/provider'
import { routes } from './config'
import { Link } from 'react-router-dom'

function Experiments() {
  const { dataset } = useExperiment()
  const [text, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(dataset);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.replace(/\s+/g, ' ').trim())
  }, [text])

  useEffect(() => {
    if (dataset.length && text) {
      const _text = text.toLowerCase()
      const filtered = dataset.filter((item) => {
        return item?.sensorId.toLowerCase().includes(_text)
      })
      setFilteredData(filtered);
      return;
    }

    setFilteredData(dataset);
  }, [text, dataset]);

  return (
    <>
      <h2>Experiments</h2>
      <label>Filter by ID </label>
      <input type="text" value={text} onChange={handleChange}/>

      {filteredData.map((item) => (
        <Link key={item?.value} to={routes.experiment.path} >
          <div>{item?.sensorId}</div>
        </Link>
      ))}
    </>
  )
}

export default Experiments
