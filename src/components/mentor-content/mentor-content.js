import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PointTrackerForm from '../point-tracker-form/point-tracker-form';
import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    return (
      <div role="main" className="col-md-8 panel">
        <div className="sidebar-sticky">
          <a className="nav-link disabled sidebar-heading">
            Student Profile
          </a>
          <span className="mentor-btn">
            <Link to="/mentor/pointtracker">
              Point Tracker
            </Link>
          </span>
          {
            this.props.children
          }
          <div style={{ width: 'auto', overflow: 'auto', padding: '20px' }}>
          {
            JSON.stringify(this.props.content)
          }
          </div>
        </div>
      </div>
    );
  }
}

MentorContent.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
  btnClick: PropTypes.func,
  children: PropTypes.node,
};

export default MentorContent;
