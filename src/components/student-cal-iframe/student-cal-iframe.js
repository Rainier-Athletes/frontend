import React from 'react';

import './student-cal-iframe.scss';

class StudentCalIframe extends React.Component {
  render() {
    return (
      <React.Fragment>
        <iframe className="student-cal-iframe" src="https://www.rainierathletes.org"></iframe>
      </React.Fragment>
    );
  }
}

export default StudentCalIframe;
