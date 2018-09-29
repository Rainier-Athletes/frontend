import React from 'react';
import PropTypes from 'prop-types';

import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    return (
      <React.Fragment>
      <div role="main" className="col-md-8 panel">
        <div className="sidebar-sticky">
          <a className="nav-link disabled sidebar-heading">
            Student Profile
          </a>
          {
            this.props.content ? <button className="mentor-btn" onClick={ this.props.buttonClick }>
                Point Tracker
            </button> : null
          }

          <div style={{ width: 'auto', overflow: 'auto', padding: '20px' }}>
          {
            JSON.stringify(this.props.content)
          }
          </div>
        </div>
      </div>
      {
        this.props.children
      }
      </React.Fragment>
    );
  }
}

MentorContent.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
  btnClick: PropTypes.func,
  children: PropTypes.node,
  buttonClick: PropTypes.func,
};

export default MentorContent;
