import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './point-tracker-summary.scss';

class PointTrackerSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCopy = () => {
    const range = document.getSelection().getRangeAt(0);
    range.selectNode(document.getElementById('body'));
    window.getSelection().addRange(range);
    document.execCommand('copy');
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">
        Don&#39;t forget to paste into Basecamp!
      </Tooltip>
    );

    const { pointTracker } = this.props;

    return (
      <div className="panel summary-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title title">{ pointTracker.playingTimeOnly ? 'Mentor Granted Playing Time' : 'Point Tracker Summary' }</h5>
              <button type="button" className="close" onClick={ this.props.onClose } data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body" id="body">
              <h4>{pointTracker.title}</h4>
              <br />
              { pointTracker.pointSheetStatus.turnedIn ? null
                : <React.Fragment>
                 <p>Point Sheet not turned in.</p>
                 </React.Fragment> }
              { !pointTracker.playingTimeOnly 
                ? <React.Fragment>
                  <span className="title">
                  Game Eligibility Earned
                  </span>
                  <span> {pointTracker.earnedPlayingTime}</span>
                </React.Fragment>
                : null }
              <br />
              {pointTracker.mentorGrantedPlayingTime 
                ? <React.Fragment> 
                <span className="title">Mentor Granted Playing Time</span>
                <span>{pointTracker.mentorGrantedPlayingTime}</span>
                <br />
                <span className="title">Mentor Comments</span>
                <p>{pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}</p>
                <br /> </React.Fragment> 
                : null}
              {!pointTracker.playingTimeOnly
                ? <React.Fragment>
                    <span className="title">Student Action Items</span>
                    <p>{pointTracker.synopsisComments.studentActionItems}</p>
                    <br />
                    <span className="title">Full Synopsis Report on Google Drive</span>
                    <a href={pointTracker.synopsisLink} target="_blank" rel="noopener noreferrer">Link to Point Tracker</a>
                </React.Fragment>
                : null }
            </div>

            <div className="modal-footer">
              <OverlayTrigger placement="top" trigger="click" rootClose overlay={tooltip}>
                <button type="submit" className="btn btn-primary" onClick={this.handleCopy}>
                  <FontAwesomeIcon icon="copy" className="fa-1x copy"/>
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PointTrackerSummary.propTypes = {
  pointTracker: PropTypes.object,
  onClose: PropTypes.func,
};

export default PointTrackerSummary;
