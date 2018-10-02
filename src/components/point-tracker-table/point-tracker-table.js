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
    <div className="row">
      <div className="col-md-4">
        <select className="add-subject"
          name="teacherId"
          onChange={ this.handleChange }
          value={ this.state.teacherId }
          default=""
        >
          <option disabled defaultValue value="">Select Teacher</option>
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
      </div>
      <div className="col-md-4">
        <input className="add-subject"
          type="text"
          placeholder="Subject Name"
          name="subjectName"
          value= { this.state.subjectName }
          onChange={ this.handleChange }
        />
      </div>
      <div className="col-md-4">
        <div className="add-subject">
          <button type="button" className="add-subject-btn add-subject" onClick={ this.handleCreateSubject }>Add new subject</button>
        </div>
      </div>
    </div>
    );

    const subjectsJSX = this.props.subjects.map((subject) => {
      return (
        <SubjectColumn
          key={ `${subject.subjectName}-${subject.teacher}` }
          label={ subject.subjectName }
          subject={ subject }
          handleSubjectChange={ this.props.handleSubjectChange }
          getTeacherName={ this.props.getTeacherName }
          deleteSubject={ this.props.deleteSubject }
        />
      );
    });

    return (
      <div className="row">
        <div className="col-md-12">
          <span className="title">Point Sheet</span>
          { addNewSubjectJSX }
          <div className="point-table">
            <div className="row-labels">
              <label>Periods Missed</label>
              <label>Num. of Stamps</label>
              <label>Num. of Xs</label>
              <label>Grade</label>
            </div>
            { subjectsJSX }
          </div>
        </div>
      </div>
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
