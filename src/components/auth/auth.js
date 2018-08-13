import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  role: 'admin',
});

const Auth = roles => (Component) => {
  class HaveAuth extends React.Component {
    render() {
      const { role } = this.props;

      if (roles.includes(role)) {
        return <Component { ...this.props } />;
      }

      return null;
    }
  }

  HaveAuth.propTypes = {
    role: PropTypes.string,
  };

  return connect(mapStateToProps, null)(HaveAuth);
};

export default Auth;
