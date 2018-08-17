import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const mapStateToProps = state => ({
  role: state.role,
});

const Auth = roles => (Component) => {
  class HaveAuth extends React.Component {
    render() {
      const { role } = this.props;
      const roleBase64 = Buffer.from(role, 'base64');
      const roleAsciiAdmin = roleBase64.toString('ascii').slice(0, -1);
      const roleAsciiMentor = roleBase64.toString('ascii').slice(0);
      if (roles.includes(roleAsciiAdmin) || roles.includes(roleAsciiMentor)) {
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
