import React from 'react';
import PropTypes from 'prop-types';

import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    const student = this.props.content;
    const haveData = !!student.studentData;

    const currentSchool = haveData ? student.studentData.school.find(s => s.currentSchool).schoolName : null;
    const emptySport = {
      sport: '',
      team: '',
      league: '',
      teamCalendarUrl: '',
    };
    const currentSport = haveData ? student.studentData.sports.find(s => s.currentlyPlaying) : emptySport;
    const { 
      sport, 
      team, 
      league, 
      teamCalendarUrl,
    } = currentSport;
    const coaches = haveData ? student.studentData.coaches : null;
    const currentCoach = coaches ? coaches.find(c => c.currentCoach) : null;
    const currentCoachName = currentCoach ? `${currentCoach.firstName} ${currentCoach.lastName}` : '';

    const currentSportsJSX = haveData ? (student.studentData.sports.filter(s => s.currentlyPlaying).map((s, i) => (
      <div className="team-info" key={s._id}>
        <span className="label">Sport: {s.sport}</span>
        <span className="label">Team: {s.team}</span>
        <span className="label">League: {s.league}</span>
        <span className="label">Calendar: <a href={s.teamCalendarUrl ? s.teamCalendarUrl : '#'} 
            alt="team calendar url" 
            target="_blank"
            rel="noopener noreferrer"
            className="team-calendar-url">Click here</a></span>
      </div>
    ))) : null;

    const studentProfile = (
      <div className="student-profile container">
        <div className="profile-primary row">
          <div>
            <span className="info name">{ student.firstName } { student.lastName } </span>
            <span className="icon">{ student.studentData ? student.studentData.dateOfBirth : null } </span>
            <span className="icon">{ student.studentData ? currentSchool : null } </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Contact</span>
            <span className="icon">{ student.phone } </span>
            <span className="icon">{ student.primaryEmail } </span>
          </div>
          <div className="col-md-6">
            <span className="title">Synergy Account</span>
            <span className="icon">{haveData ? student.studentData.synergy.username : ''}</span>
            <span className="icon">{haveData ? Buffer.from(student.studentData.synergy.password, 'base64').toString() : ''}</span>
          </div>
        </div>
        <div className="row">
          <div className="profile-link">
            <a className="btn-link-1" href={ student.studentData ? student.studentData.synopsisReportArchiveUrl : null }>Synopsis Report Archive</a>
            <a className="btn-link-1" href={ student.studentData ? student.studentData.googleDocsUrl : null } >Student Documents</a>
            <a className="btn-link-1" href={ student.studentData ? student.studentData.googleCalendarUrl : null }>Student Calendar</a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Sport Info</span>
            {currentSportsJSX}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Family Info</span>
              <span className="label">Name</span>
              <span className="label">Rel.</span>
              <span className="label">Email</span>
              <span className="label">Cell</span>
              <span className="label">Address</span>
              <span className="label">Others</span>
          </div>
        </div>
      </div>
    );

    return (
      <React.Fragment>
      <div role="main" className="col-md-8 panel">
        <div className="sidebar-sticky">
          <a className="nav-link disabled sidebar-heading">
            Student Profile
          </a>
          {
            student ? <a className="mentor-btn" onClick={ this.props.buttonClick }>
                Point Tracker
            </a> : null
          }
          {
            student.studentData ? studentProfile : null
          }
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
  content: PropTypes.object,
  title: PropTypes.string,
  btnClick: PropTypes.func,
  children: PropTypes.node,
  buttonClick: PropTypes.func,
};

export default MentorContent;
