import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PointTrackerForm from '../point-tracker-form/point-tracker-form';
import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    return (
      <div role="main" className="col-md-8 panel">
        <h1>hello</h1>
        <PointTrackerForm></PointTrackerForm>
      </div>
    );
  }
}

export default MentorContent;
