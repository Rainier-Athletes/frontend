import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// import PointTrackerForm from '../point-tracker-form/point-tracker-form';
// import Dashboard from '../dashboard/dashboard';
import AuthRedirect from '../auth-redirect/auth-redirect';
import Admin from '../admin/admin';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
// import Auth from '../auth/auth';
// import AdminModal from '../admin-modal/admin-modal';

import './app.scss';

// const AdminUser = Auth(['admin']);

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
            {/* <Route expact path="/admin" component={ AdminUser(Admin) } /> */}
            {/* <AdminModal /> */}

            {/* <Route exact path="*" component={AuthRedirect} /> */}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
