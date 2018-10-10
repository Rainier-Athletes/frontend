import React from 'react';
import PropTypes from 'prop-types';
import AdminSidebar from '../admin-sidebar/admin-sidebar';
import AdminContent from '../admin-content/admin-content';
import AdminTable from '../admin-table/admin-table';
import * as routes from '../../lib/routes';

import './_admin-dashboard.scss';

export default class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: '/admindashboard',
    };
    console.log('AdminDashboard props', props);
    console.log('AdminDashboard constructor state', this.state); 
  }

  handleSidebarClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    console.log('dashboard href:', href, 'this.state.show', this.state.show);
    switch (href) {
      case routes.ADMIN_DATA_ROUTE:
        this.setState((prevState) => {
          console.log('setState cb setting show to admin data route');
          return ({ ...prevState, show: routes.ADMIN_DATA_ROUTE });
        });
        break;
      default:
    }
  }

  render() {
    console.log('render this.state', this.state);
    if (this.state.show === routes.ADMIN_DATA_ROUTE) {
      return (
        <div>
          <AdminTable />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <AdminSidebar onClick={ this.handleSidebarClick }/>
          <AdminContent show={ this.state.show }/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AdminDashboard.propTypes = {
  location: PropTypes.object,
};
