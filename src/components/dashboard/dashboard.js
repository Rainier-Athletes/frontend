import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Iframe from '../iframe/iframe';
import * as routes from '../../lib/routes';
// import PointTrackerForm from '../point-tracker-form/point-tracker-form';

import './_dashboard.scss';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
});

class Dashboard extends React.Component {
  renderJSX = (loggedIn) => {
    // <PointTrackerForm />
    const iframe = (
      <React.Fragment>
        <Iframe />
      </React.Fragment>
    );

    const dashboard = () => {
      return <Redirect to={routes.ADMIN_ROUTE} />;
    };

    return loggedIn ? dashboard() : iframe;
  };

  render() {
    return (
      <React.Fragment>

      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  loggedIn: PropTypes.bool,
};

export default connect(mapStateToProps, null)(Dashboard);
