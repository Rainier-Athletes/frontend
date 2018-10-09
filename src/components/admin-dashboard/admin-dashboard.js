import React from 'react';
import PropTypes from 'prop-types';
import AdminSidebar from '../admin-sidebar/admin-sidebar';
import AdminContent from '../admin-content/admin-content';
import AdminTable from '../admin-table/admin-table';
import * as routes from '../../lib/routes';

import './_admin-dashboard.scss';

export default class AdminDashboard extends React.Component {
  // constructor(props) {
  //   super(props);
    
  state = {
    show: 'nada',
  };
  //   console.log('constructor state', this.state);
  // }

  // static getDerivedStateFromProps = (nextProps) => {
  //   if (nextProps.show) {
  //     return { show: nextProps.show };
  //   }

  //   return null;
  // }

  handleSidebarClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    console.log('dashboard href:', href, 'this.state', this.state);
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
  show: PropTypes.string,
};
