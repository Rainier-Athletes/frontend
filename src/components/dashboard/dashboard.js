import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Iframe from '../iframe/iframe';

import './_dashboard.scss';

const mapStateToProps = state => ({
  myProfile: state.myProfile,
  loggedIn: !!state.token,
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'mentor',
    };
  }

  renderJSX = (loggedIn) => {
    const iframe = (
      <React.Fragment>
        <Iframe />
      </React.Fragment>
    );

    return loggedIn ? null : iframe;
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
  myProfile: PropTypes.object,
};

export default connect(mapStateToProps, null)(Dashboard);
