import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Iframe from '../iframe/iframe';

import * as profileActions from '../../actions/profile';

import './_dashboard.scss';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
});

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchProfile()
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  }

  renderJSX = (loggedIn) => {
    const iframe = (
      <React.Fragment>
        <Iframe />
      </React.Fragment>
    );

    const name = this.props.profile ? this.props.profile.firstName : null;
    const dashboard = (
      <div className="main">
        <p>Welcome, { name }</p>
      </div>
    );
    return loggedIn ? dashboard : iframe;
  };

  render() {
    return (
      <React.Fragment>
        {
          this.renderJSX(this.props.loggedIn)
        }
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  loggedIn: PropTypes.bool,
  fetchProfile: PropTypes.func,
  profile: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
