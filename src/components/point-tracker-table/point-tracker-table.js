import React from 'react';
import PropTypes from 'prop-types';
import SubjectColumn from '../subject-column/subject-column';

import './point-tracker-table.scss';

const defaultState = {
  subjectName: '',
  teacherId: '',
};

export default class PointTrackerTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }
  
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleCreateSubject = () => {
    if (this.state.subjectName && this.state.teacherId) {
      this.props.createSubject(this.state.subjectName, this.state.teacherId);
      this.setState(() => defaultState);
    }
  }

  render() {
    const addNewSubjectJSX = (
    <div>
      <h4>Subjects</h4>
      <select 
        name="teacherId" 
        onChange={ this.handleChange } 
        value={ this.state.teacherId }
      >
        <option disabled value="">Select Teacher</option>
        {
          this.props.teachers.map(teacher => (
            <option 
              key={ teacher._id }
              value={ teacher._id }
            >{ `${teacher.firstName} ${teacher.lastName}` }
          </option>
          ))
        }
      </select>
      <input 
        type="text" 
        placeholder="Subject Name" 
        name="subjectName"
        value= { this.state.subjectName }
        onChange={ this.handleChange }
      />
      <div className="new-subject">
      <button type="button" onClick={ this.handleCreateSubject }>Add new subject</button>
      </div>
    </div>
    );
  
    const subjectsJSX = this.props.subjects.map(subject => (
    <SubjectColumn
      key={ `${subject.subjectName}-${subject.teacher}` } 
      label={ subject.subjectName }
      subject={ subject }
      handleSubjectChange={ this.props.handleSubjectChange }
      getTeacherName={ this.props.getTeacherName }
      deleteSubject={ this.props.deleteSubject }
    />
    ));

    return (
    <React.Fragment>
      <h4>Point Sheet and Grades</h4>
      { addNewSubjectJSX }
      <div className="point-table">
        <div className="row-labels">
          <label></label>
          <label>Periods Missed</label>
          <label>Num. of Stamps</label>
          <label>Num. of Xs</label>
          <label>Grade</label>
        </div>
        { subjectsJSX }
      </div>
      </React.Fragment>
    );
  }
}

PointTrackerTable.propTypes = {
  subjects: PropTypes.array,
  teachers: PropTypes.array,
  handleSubjectChange: PropTypes.func,
  getTeacherName: PropTypes.func,
  createSubject: PropTypes.func,
  deleteSubject: PropTypes.func,
};
