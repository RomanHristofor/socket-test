import { useExperiment } from '../api/provider'
import { Status } from '../api/provider'

function Home() {
  const { status } = useExperiment()

  return (
    <>
      <h1>HOME PAGE</h1>
      <h3>Status: {status === Status.Started ? ' ON' : ' OFF'}</h3>
    </>
  )
}

export default Home