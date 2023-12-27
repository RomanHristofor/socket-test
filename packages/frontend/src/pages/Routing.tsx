import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { routes } from './config'
import Menu from './Menu'
const HomePage = lazy(() => import('./Home'))
const ExperimentsPage = lazy(() => import('./Experiments'))
const ExperimentPage = lazy(() => import('./Experiment'))

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home.path} element={<Menu />}>
          <Route index 
            element={<Suspense><HomePage /></Suspense>} />
          <Route path={routes.experiments.path}
            element={<Suspense><ExperimentsPage /></Suspense>} />
          <Route path={routes.experiment.path}
            element={<Suspense><ExperimentPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
