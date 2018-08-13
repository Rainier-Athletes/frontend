import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import PointTrackerForm from '../point-tracker-form/point-tracker-form';
// import Dashboard from '../dashboard/dashboard';
import AuthRedirect from '../auth-redirect/auth-redirect';
// import Profile from '../profile/profile';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';

import './app.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            {/* <Navbar /> */}
            <Dashboard />
            <Route exact path="*" component={AuthRedirect} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
