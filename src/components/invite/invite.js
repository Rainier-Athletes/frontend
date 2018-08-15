import React from 'react';
import PropTypes from 'prop-types';

import './invite.scss';

const Invite = (props) => {
  console.log(props);
  return (
    <React.Fragment>
      <br />
      <div id={ props._id } className="invite">
        {
          props.email
        }
      </div>
    </React.Fragment>

  );
};

Invite.propTypes = {
  _id: PropTypes.object,
  email: PropTypes.string,
};

export default Invite;
