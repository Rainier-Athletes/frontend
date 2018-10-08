import React from 'react';
import AdminSidebar from '../admin-sidebar/admin-sidebar';
import AdminContent from '../admin-content/admin-content';

import './_admin-dashboard.scss';

export default class AdminDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <AdminSidebar />
          <AdminContent />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// AdminDashboard.proptypes = {

// }
