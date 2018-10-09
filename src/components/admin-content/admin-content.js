import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminTable from '../admin-table/admin-table';
import * as routes from '../../lib/routes';

// import Navbar from '../navbar/navbar';
// import AdminUser from '../app/app';
// import Auth from '../auth/auth';

import './_admin-content.scss';

const mapStateToProps = state => ({
  myProfile: state.myProfile,
  loggedIn: !!state.token,
  profiles: state.profile,
});

// const name = Auth(['admin']);

class AdminContent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: null,
    };
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      console.log('admin content props.show', this.props.show);
      this.setState({ show: this.props.show });
    }
  }

  render() {
    console.log('admin content props.show', this.props.show);
    const name = this.props.myProfile ? this.props.myProfile.firstName : null;
    return (
      <div role="main" className="col-md-8 panel">
        <h1>Hello { name } this.props.show: { this.props.show }</h1>
        {/* {this.state.show === routes.ADMIN_DATA_ROUTE ? <AdminTable /> : null } */}
        {/* <AdminTable /> */}
      </div>
      // <div>
      //   <button type='submit' className=''>Create New Points Tracker</button>
      // </div>
    );
  }
}

AdminContent.propTypes = {
  myProfile: PropTypes.object,
  show: PropTypes.string,
};

export default connect(mapStateToProps, null)(AdminContent);
