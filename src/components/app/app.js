import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import AuthRedirect from '../auth-redirect/auth-redirect';
import Admin from '../admin/admin';
import Navbar from '../navbar/navbar';

// import Dashboard from '../dashboard/dashboard';
// import Whitelist from '../whitelist/whitelist';

import Auth from '../auth/auth';
import PointTrackerForm from '../point-tracker-form/point-tracker-form';

import './app.scss';

library.add(faAngleDown, faUserPlus);

const AdminUser = Auth(['admin']);

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            {/* TODO: uncomment navbar */}
            <Navbar />
            {/* TODO: figure out why the dashboard component is preventing navigating away from the /admin.  */}
            {/* <Dashboard /> */} 
            <Route exact path="*" component={AuthRedirect} />
            <Route expact path="/admin" component={ AdminUser(Admin) } />

      <Route exact path="/mentor"component={PointTrackerForm} />
          </div>
        </BrowserRouter>
      {/* <div className="footer"> */}
        <footer className="footer">
           <a href="https://www.rainierathletes.org" alt="link to Rainier Athletes website"> ©2018 Rainier Athletes |</a>
          <a href="https://github.com/Rainier-Athletes" alt="link to GitHub repo">CodeFellows</a>
        </footer>
      {/* </div> */}
      </div>
    );
  }
}
