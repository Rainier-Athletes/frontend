import React from 'react';
import AdminDashboardSidebar from '../admin-dashboard-sidebar/admin-dashboard-sidebar';
import AdminDashboardContent from '../admin-dashboard-content/admin-dashboard-content';

import './_admin-dashboard.scss';

export default class AdminDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <AdminDashboardSidebar />
          <AdminDashboardContent />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// AdminDashboard.proptypes = {

// }
