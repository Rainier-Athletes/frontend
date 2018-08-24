import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker } = props;
  return (
    <div className="synopsis-report">
      <h1>{ pointTracker.studentName }</h1>
      <p>{ pointTracker.synopsisComments.extraPlayingTime }</p>
      <p>{ pointTracker.synopsisComments.mentorGrantedPlayingTime }</p>
      <p>{ pointTracker.synopsisComments.studentActionItems }</p>
      <p>{ pointTracker.synopsisComments.sportsUpdate }</p>
      <p>{ pointTracker.synopsisComments.additionalComments }</p>
    </div>
  );
}

SynopsisReport.propTypes = {
  pointTracker: PropTypes.object,
};
