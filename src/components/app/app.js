import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AuthRedirect from '../auth-redirect/auth-redirect';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
// import PointTrackerForm from '../point-tracker-form/point-tracker-form';
// import Profile from '../profile/profile';
// import Auth from '../auth/auth';
import Admin from '../admin/admin';
import MentorTable from '../mentor-table/mentor-table';

import './app.scss';


export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Navbar />
            <Dashboard />
            <MentorTable />
            <Route exact path="*" component={AuthRedirect} />
            <Route exact path="/admin" component={Admin} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
