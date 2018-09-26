import React from 'react';
import PropTypes from 'prop-types';
import './point-tracker-summary.scss';

export default function PointTrackerSummary(props) {
  const { pointTracker } = props;
  return (
    <div>
      <h4>Point Tracker Summary</h4>
      <h6>{pointTracker.title}</h6>
      <p>Playing Time Earned: {pointTracker.earnedPlayingTime}</p>
      <p>Mentor Granted Playing Time: {pointTracker.mentorGrantedPlayingTime}</p>
      <p>{pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}</p>
      <h6>Student Action Items</h6>
      <p>{pointTracker.synopsisComments.studentActionItems}</p>
      <a href={pointTracker.synopsisLink}>Full synopsis report on Google Drive</a>
    </div>
  );
}

PointTrackerSummary.propTypes = {
  pointTracker: PropTypes.object,
};
