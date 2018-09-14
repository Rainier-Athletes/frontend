import React from 'react';
import Sidebar from '../side-bar/side-bar';
import MentorContent from '../mentor-content/mentor-content';

import './_mentor.scss';

class Mentor extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <Sidebar />
          <MentorContent />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Mentor;
