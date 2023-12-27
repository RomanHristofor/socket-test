import { Outlet, Link } from 'react-router-dom'
import { routes } from './config'

const Menu = () => {
  return (
    <div style={{ width: '100%' }}>
      <ul style={{ listStyle: 'none' }}>
        <li>
          <Link to={routes.home.path}>Home</Link>
        </li>
        <li>
          <Link to={routes.experiments.path}>Experiments</Link>
        </li>
        <li>
          <Link to={routes.experiment.path}>Experiment</Link>
        </li>
      </ul>
      <hr />
      <Outlet />
    </div>
  );
};

export default Menu;
