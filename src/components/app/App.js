import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Logo from '../logo/Logo';
import RoomsDashboard from '../RoomsDashboard/RoomsDashboard';

function App() {
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
          </ul>
        </nav>
      <Switch>
        <Route path="/" exact component={Logo} />
        <Route path="/rooms" exact component={RoomsDashboard} />
        <Route render={() => <h1>404: page not found</h1>} />
      </Switch>
      </main>
    </Router>
  );
}

export default App;
