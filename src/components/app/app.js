import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// import Landing from '../landing/landing';
// import Dashboard from '../dashboard/dashboard';
import AuthRedirect from '../auth-redirect/auth-redirect';
// import Profile from '../profile/profile';
import Navbar from '../navbar/navbar';
// import AdminModal from '../admin-modal/admin-modal';
import MentorTable from '../mentor-table/mentor-table';

import './app.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div>
          <Navbar />
          {/* <AdminModal /> */}
          <MentorTable />
          <Route exact path="*" component={AuthRedirect} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
