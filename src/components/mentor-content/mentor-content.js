import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminPickStudent from '../admin-pick-student/admin-pick-student';
import * as util from '../../lib/utils';

import './_mentor-content.scss';

class MentorContent extends React.Component {
  render() {
    const student = this.props.content;
    const haveData = !!student.studentData;

    const currentSchool = haveData ? student.studentData.school.find(s => s.currentSchool) : null;
    const currentSchoolName = currentSchool ? currentSchool.schoolName : '';

    const currentSportsJSX = haveData ? (student.studentData.sports.filter(s => s.currentlyPlaying).map(s => (
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

    const currentCoachesJSX = haveData ? (student.studentData.coaches.filter(c => c.currentCoach).map(c => (
      <div className="current-coaches" key={c._id}>
        <span className="label">Name: {`${c.coach.firstName} ${c.coach.lastName}`}</span>
        <span className="label">{c.coach.cellPhone ? `Cell: ${c.coach.cellPhone}` : `Phone: ${c.coach.phone}`}</span>
        <span className="label">Email: <a
          href={c.coach.primaryEmail ? `mailto:${c.coach.primaryEmail}` : '#'}
          target="_blank"
          rel="noopener noreferrer">{c.coach.primaryEmail}</a></span>
      </div>
    ))) : null;

    const familyMembersJSX = haveData ? (student.studentData.family.map(f => (
      <div className="current-family" key={f._id}>
        <span className="label">Name: {`${f.member.firstName} ${f.member.lastName}`}</span>
        <span className="label">Student Residence: {f.weekdayGuardian ? 'weekdays' : ''} {f.weekendGuardian ? 'weekends' : ''}</span>
        <span className="label">Cell: {f.member.cellPhone ? f.member.cellPhone : ''}</span>
        <span className="label">Phone: {f.member.phone ? f.member.phone : ''}</span>
        <span className="label">Primary email: <a
          href={f.member.primaryEmail ? `mailto:${f.member.primaryEmail}` : '#'}
          target="_blank"
          rel="noopener noreferrer">{f.member.primaryEmail}</a></span>
      </div>
    ))) : null;

    const studentProfile = (
      <div className="student-profile container">
        <div className="profile-primary row">
          <div>
            <span className="info name">{ student.firstName } { student.lastName } </span>
            <span>
              <FontAwesomeIcon icon="birthday-cake" className="fa-2x"/>
              { student.studentData ? util.convertDateToValue(student.studentData.dateOfBirth) : null }
            </span>
            <span>
              <FontAwesomeIcon icon="school" className="fa-2x"/>
              { student.studentData ? currentSchoolName : null }
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">

            <span className="title">Contact</span>
            <span>
              <FontAwesomeIcon icon="phone" className="fa-2x"/>
              { student.phone }
            </span>
            <span>
              <FontAwesomeIcon icon="at" className="fa-2x"/>
              { student.primaryEmail }
            </span>
          </div>
          <div className="col-md-6">
            <span className="title"><a href="https://wa-bsd405-psv.edupoint.com/PXP2_Login_Student.aspx?regenerateSessionId=True"
              alt="team calendar url"
              target="_blank"
              rel="noopener noreferrer">Synergy Account (Click to Visit)</a>
            </span>
            <span>
              <FontAwesomeIcon icon="user" className="fa-2x"/>
              {haveData ? student.studentData.synergy.username : ''}
            </span>
            <span>
              <FontAwesomeIcon icon="key" className="fa-2x"/>
              {haveData ? Buffer.from(student.studentData.synergy.password, 'base64').toString() : ''}
            </span>
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
            <span className="title">Current Coaches</span>
            {currentCoachesJSX}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Family Info</span>
              {familyMembersJSX}
          </div>
        </div>
      </div>
    );
    
    return (
      <React.Fragment>
      <div role="main" className="col-md-8 panel content-panel" style={ { overflow: this.props.subPT ? 'inherit' : 'scroll' } }>
        <div className="sidebar-sticky">
          <a className="nav-link disabled sidebar-heading">
            { this.props.subPT ? 'Select Student' : 'Student Profile' }
          </a>
          {
            Object.keys(student).length !== 0 ? <button type="submit" className="linkToPT" onClick={ this.props.buttonClick }>
                Synopsis Report
            </button> : null
          }
          {
            student.studentData ? studentProfile : null
          }
          {
            this.props.subPT ? <AdminPickStudent /> : null
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
  subPT: PropTypes.boolean,
};

export default MentorContent;
