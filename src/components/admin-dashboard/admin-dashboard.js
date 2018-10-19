import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminSidebar from '../admin-sidebar/admin-sidebar';
import AdminContent from '../admin-content/admin-content';
import AdminTable from '../admin-table/admin-table';
import * as routes from '../../lib/routes';

import './_admin-dashboard.scss';

const mapStateToProps = state => ({
  students: state.students,
});

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: '/admindashboard',
    };
  }

  handleSidebarClick = (e) => {
    const show = e.currentTarget.getAttribute('show');
    switch (show) {
      case routes.POINTS_TRACKER_ROUTE:
        return this.setState({ show: routes.POINTS_TRACKER_ROUTE });
      case routes.EXTRACT_CSV_ROUTE:
        return this.setState({ show: routes.EXTRACT_CSV_ROUTE });
      default:
        return this.setState({ show: 'nada' });
    }
  }

  render() {
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
          <AdminSidebar onClick={ this.handleSidebarClick } />
          <AdminTable />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AdminDashboard.propTypes = {
  students: PropTypes.array,
};

export default connect(mapStateToProps)(AdminDashboard);
