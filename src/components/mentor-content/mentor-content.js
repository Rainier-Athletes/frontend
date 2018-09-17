import React from 'react';
import PropTypes from 'prop-types';

import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    return (
      <div role="main" className="col-md-8 panel">
        <div className="sidebar-sticky">
          <a className="nav-link disabled sidebar-heading">
            {
              this.props.title
            }
          </a>
          <span className="mentor-btn" onClick={this.props.btnClick}>Point Tracker</span>
          {
            this.props.content
          }
        </div>
      </div>
    );
  }
}

MentorContent.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
  btnClick: PropTypes.func,
};

export default MentorContent;
