import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Iframe from '../iframe/iframe';

import './_dashboard.scss';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
});

const mapDispatchToProps = dispatch => ({
});

class Dashboard extends React.Component {
  renderJSX = (loggedIn) => {
    const iframe = (
      <React.Fragment>
        <Iframe />
      </React.Fragment>
    );

    const dashboard = (
      <div className="main">
        <h1>Dashboard</h1>
      </div>
    );
    console.log(loggedIn);
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
