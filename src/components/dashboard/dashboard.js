import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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

  renderMentor = () => {
    return <div className="nav"><Link to="/mentor">Mentor</Link></div>;
  }

  renderAdmin = () => {
    return <div className="nav"><Link to="/mentor">Mentor</Link><Link to="/admin">Admin</Link></div>;
  }

  renderJSX = () => {
    if (this.props.myProfile) {
      return this.props.myProfile.role === 'mentor' ? this.renderMentor() : this.renderAdmin();
    }
    return null;
  }

  render() {
    return (
      <React.Fragment>
        {
          this.renderJSX()
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
