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
    console.log('AdminDashboard props', props);
    console.log('AdminDashboard constructor state', this.state); 
  }

  handleSidebarClick = (e) => {
    const show = e.currentTarget.getAttribute('show');
    console.log('sidebarClick show:', show, 'this.state.show', this.state.show);
    switch (show) {
      case routes.POINTS_TRACKER_ROUTE:
        this.setState((prevState) => {
          console.log('setState cb setting show to', routes.POINTS_TRACKER_ROUTE);
          return ({ ...prevState, show: routes.POINTS_TRACKER_ROUTE });
        });
        break;
      case '/exportdata':
        return this.setState({ show: '/exportdata' });
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
          <AdminSidebar onClick={ this.handleSidebarClick } />
          <AdminContent show={ this.state.show } students={this.props.students} />
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
