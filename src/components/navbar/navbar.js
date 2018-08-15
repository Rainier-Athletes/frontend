import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as authActions from '../../actions/auth';
import * as routes from '../../lib/routes';
import googleBtn from '../../assets/google-btn.png';
import rainierBtn from '../../assets/rainier-logo-horizontal.png';
import './navbar.scss';

import * as profileActions from '../../actions/profile';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
  myProfile: state.myProfile,
});

const mapDispatchToProps = dispatch => ({
  doLogout: () => dispatch(authActions.logout()),
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
});

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
    };
  }

  setGoogleOAuthUrl = () => {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirect = `redirect_uri=${API_URL}/oauth/google`;
    // scope = resources your app can access on a user's behalf
    const scope = 'scope=openid%20email%20profile%20https://www.googleapis.com/auth/drive';
    const clientId = `client_id=${GOOGLE_OAUTH_ID.trim()}`;
    // prompt determines if we ask the user for consent first to sign in via Google
    const prompt = 'prompt=consent%20select_account';
    const responseType = 'response_type=code';
    console.log('oauthURL:', `${baseUrl}?${redirect}&${scope}&${clientId}&${prompt}&${responseType}`); // eslint-disable-line
    return `${baseUrl}?${redirect}&${scope}&${clientId}&${prompt}&${responseType}&access_type=offline`;
    // return [baseUrl, redirect, scope, clientId, prompt, responseType].join('');
  }

  componentDidMount() {
    this.props.fetchProfile()
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  }

  handleClickOutside = () => {
    this.setState({
      dropdown: false,
    });
  }

  handleDropDownToggle = () => {
    this.setState(prevState => ({
      dropdown: !prevState.dropdown,
    }));
  }

  renderJSX = (loggedIn) => {
    const JSXNotLoggedIn = (
      <React.Fragment>
        <span className="logo"><Link to={routes.ROOT_ROUTE}><img className="rainier-logo" src={ rainierBtn } /></Link></span>
        <span className="login"><a href={ this.setGoogleOAuthUrl() }><img className="google-btn" src={ googleBtn } /></a></span>
      </React.Fragment>
    );

    const dropdown = (
      <div className="dropdown">
        <button onClick={ this.props.doLogout }>Logout</button>
      </div>
    );

    const name = this.props.myProfile ? this.props.myProfile.firstName : null;

    const JSXLoggedIn = (
      <React.Fragment>
        <span className="logo"><Link to={routes.ROOT_ROUTE}><img className="rainier-logo" src={ rainierBtn } /></Link></span>
        <span className="login">
          <button onClick={ this.handleDropDownToggle }>
            Welcome, { name }
            <FontAwesomeIcon icon="angle-down" />
          </button>
          {
            this.state.dropdown ? dropdown : null
          }
        </span>
      </React.Fragment>
    );

    return loggedIn ? JSXLoggedIn : JSXNotLoggedIn;
  }

  render() {
    const { loggedIn } = this.props;
    return (
      <header className="header">
        <nav className="navbar">
          {this.renderJSX(loggedIn)}
        </nav>
      </header>
    );
  }
}

Navbar.propTypes = {
  loggedIn: PropTypes.bool,
  doLogout: PropTypes.func,
  fetchMyProfile: PropTypes.func,
  myProfile: PropTypes.object,
  fetchProfile: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
