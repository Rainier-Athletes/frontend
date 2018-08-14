import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// import Landing from '../landing/landing';
// import Dashboard from '../dashboard/dashboard';
import AuthRedirect from '../auth-redirect/auth-redirect';
import Admin from '../admin/admin';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';

import './app.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Navbar />
            <Dashboard />
            <Route exact path="*" component={AuthRedirect} />
            <Route exact path="/admin" component={Admin} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
