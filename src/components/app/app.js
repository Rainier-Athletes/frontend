import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import AuthRedirect from '../auth-redirect/auth-redirect';
import Admin from '../admin/admin';
import Navbar from '../navbar/navbar';
import Dashboard from '../dashboard/dashboard';
import Whitelist from '../whitelist/whitelist';
import Auth from '../auth/auth';
import PointTrackerForm from '../point-tracker-form/point-tracker-form';
// import * as routes from '../../lib/routes';
// import Auth from '../auth/auth';
// import AdminModal from '../admin-modal/admin-modal';

import './app.scss';

library.add(faAngleDown, faUserPlus);

const AdminUser = Auth(['admin']);

export default class App extends React.Component {
  // <Route exact path={routes.MENTOR_ROUTE} component={PointTrackerForm} />
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            {/* TODO: uncomment navbar */}
            {/* <Navbar /> */}
            {/* TODO: figure out why the dashboard component is preventing navigating away from the /admin.  */}
            {/* <Dashboard /> */} 
            <Route exact path="*" component={AuthRedirect} />
            <Route exact path="/admin" component={ AdminUser(Admin) } />
            <Route exact path="/whitelist" component={ AdminUser(Whitelist) } />
            <Route exact path="/mentor" component={ PointTrackerForm } />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
