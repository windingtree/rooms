import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Logo from '../logo/Logo';

function App() {
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </nav>
      <Switch>
        <Route path="/" exact component={Logo} />
        <Route render={() => <h1>404: page not found</h1>} />
      </Switch>
      </main>
    </Router>
  );
}

export default App;
