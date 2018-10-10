import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faUserPlus } from '@fortawesome/free-solid-svg-icons'; //eslint-disable-line

import AuthRedirect from '../auth-redirect/auth-redirect';
import Mentor from '../mentor/mentor';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
import AdminDashboard from '../admin-dashboard/admin-dashboard';
import AdminTable from '../admin-table/admin-table';
import Auth from '../auth/auth';

import * as routes from '../../lib/routes';

import './app.scss';

library.add(faAngleDown, faUserPlus);

const AdminUser = Auth(['admin']);
const MentorUser = Auth(['mentor', 'admin']);

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Navbar />
            <Dashboard />
            <Route exact path="*" component={AuthRedirect} />
            <Route exact path={routes.ADMIN_DASHBOARD_ROUTE} component={ AdminUser(AdminDashboard) } />
            <Route exact path={routes.ADMIN_DATA_ROUTE} component={ AdminUser(AdminTable) } />
            <Route exact path={routes.MENTOR_ROUTE} component={ MentorUser(Mentor) } />
          </div>
        </BrowserRouter>
        <footer className="footer">
           <a href="https://www.rainierathletes.org" alt="Link to Rainier Athletes website"> ©2018 Rainier Athletes | </a>
           <a href="https://github.com/Rainier-Athletes" alt="Link to GitHub repository">CodeFellows</a>
        </footer> */
      </div>
    );
  }
}
