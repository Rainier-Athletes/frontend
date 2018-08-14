import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import AuthRedirect from '../auth-redirect/auth-redirect';
import Admin from '../admin/admin';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
import Auth from '../auth/auth';

import './app.scss';

library.add(faAngleDown);


const AdminUser = Auth(['admin']);

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Navbar />
            <Dashboard />
            <Route exact path="*" component={AuthRedirect} />
            <Route expact path="/admin" component={ AdminUser(Admin) } />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
