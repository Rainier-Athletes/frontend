import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import base64 from 'base-64';


const mapStateToProps = state => ({
  role: state.role,
});

const Auth = roles => (Component) => {
  class HaveAuth extends React.Component {
    render() {
      const { role } = this.props;
      const roleBase64 = Buffer.from(role, 'base64');
      const roleAscii = roleBase64.toString('ascii').slice(0, -1);

      if (roles.includes(roleAscii)) {
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
