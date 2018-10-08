import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Navbar from '../navbar/navbar';
import './_admin-content.scss';
// import AdminUser from '../app/app';
import Auth from '../auth/auth';

const mapStateToProps = state => ({
  myProfile: state.myProfile,
  loggedIn: !!state.token,
});

const name = Auth(['admin']);

class AdminContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'admin',
    };
  }

  render() {
    return (
      <div role="main" className="col-md-8 panel">
        <h1>Hello { name }</h1>
      </div>
      // <div>
      //   <button type='submit' className=''>Create New Points Tracker</button>
      // </div>
    );
  }
}

AdminContent.proptypes = {

};

export default connect(mapStateToProps, null)(AdminContent);
