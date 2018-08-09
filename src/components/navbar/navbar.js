import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from '../../actions/auth';
import * as routes from '../../lib/routes';
import googleBtn from '../../assets/google-btn.png';
import rainierBtn from '../../assets/rainier-logo-horizontal.png';
import './navbar.scss';

const mapStateToProps = state => ({
  loggedIn: !!state.token,
});

const mapDispatchToProps = dispatch => ({
  doLogout: () => dispatch(authActions.logout()),
});

class Navbar extends React.Component {
  setGoogleOAuthUrl = () => {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth?';
    const redirect = `redirect_uri=${API_URL}/oauth/google`;
    const scope = '&scope=openid%20email%20profile';
    const clientId = `&client_id=${GOOGLE_OAUTH_ID.trim()}`;
    const prompt = '&prompt=consent%20select_account';
    const responseType = '&response_type=code';

    return [baseUrl, redirect, scope, clientId, prompt, responseType].join('');
  }

  renderJSX = (loggedIn) => {
    const JSXNotLoggedIn = (
      <React.Fragment>
        <span className="logo"><Link to={routes.ROOT_ROUTE}><img className="rainier-logo" src={ rainierBtn } /></Link></span>
        <span className="login"><a href={ this.setGoogleOAuthUrl() }><img className="google-btn" src={ googleBtn } /></a></span>
      </React.Fragment>
    );


    const JSXLoggedIn = (
      <ul>
        <li><Link to={routes.ROOT_ROUTE}>Rainier Athletes</Link></li>
      </ul>
    );

    return loggedIn ? JSXLoggedIn : JSXNotLoggedIn;
  }

  render() {
    const { loggedIn, doLogout } = this.props;
    return (
      <header className="header">
        <nav className="navbar">
          {this.renderJSX(loggedIn)}
        </nav>
        {
          loggedIn ? <button onClick={ doLogout }>Logout</button> : null
        }
      </header>
    );
  }
}

Navbar.propTypes = {
  loggedIn: PropTypes.bool,
  doLogout: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
