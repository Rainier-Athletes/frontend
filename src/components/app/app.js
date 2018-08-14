import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

// import Landing from '../landing/landing';
// import Dashboard from '../dashboard/dashboard';
import AuthRedirect from '../auth-redirect/auth-redirect';
// import Profile from '../profile/profile';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
import Auth from '../auth/auth';
import Admin from '../admin/admin';
// import AdminModal from '../admin-modal/admin-modal';

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
            {/* <AdminModal /> */}

            <Route exact path="*" component={AuthRedirect} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
