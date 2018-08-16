import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import './table-menu.scss';
import MentorTable from '../mentor-table/mentor-table';
import StudentTable from '../student-table/student-table';
import TeacherTable from '../teacher-table/teacher-table';
import CoachTable from '../coach-table/coach-table';

export default class TableMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'mentors',
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      selected: e.target.name,
    });
  }

  renderTable = () => {
    if (this.state.selected === 'mentors') {
      return <MentorTable />;
    }
    if (this.state.selected === 'students') {
      return <StudentTable />;
    }
    if (this.state.selected === 'teachers') {
      return <TeacherTable />;
    }
    if (this.state.selected === 'coaches') {
      return <CoachTable />;
    }
    return undefined;
  }

  render() {
    return (
      <React.Fragment>
      <form className="table-menu">
        <button className="table-menu-btn" name="students" onClick={ this.handleClick }>Students</button>
        <button className="table-menu-btn" name="mentors" onClick={ this.handleClick }>Mentors</button>
        <button className="table-menu-btn" name="teachers" onClick={ this.handleClick }>Teachers</button>
        <button className="table-menu-btn" name="coaches" onClick={ this.handleClick }>Coaches</button>
      </form>
      {
        this.renderTable()
      }
      </React.Fragment>
    );
  }
}
