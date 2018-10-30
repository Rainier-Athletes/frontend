import React from 'react';
import PropTypes from 'prop-types';
import SubjectColumn from '../subject-column/subject-column';

import './point-tracker-table.scss';

const defaultState = {
  subjectName: '',
  teacherId: '',
  editing: false,
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

  toggleEditing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ editing: !this.state.editing });
  }

  saveSubjectTable = (e) => {
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
    this.props.saveSubjectTable();
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
            this.props.teachers.sort((a, b) => (a.teacher.lastName.toLowerCase() > b.teacher.lastName.toLowerCase() ? 1 : -1))
              .map(t => (
                <option
                  key={ t.teacher._id }
                  value={ t.teacher._id }
                >{ `${t.teacher.lastName}, ${t.teacher.firstName}` }
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
          value={ this.state.subjectName }
          onChange={ this.handleChange }
        />
      </div>
      <div className="col-md-4">
        <div className="add-subject">
          <button type="button" className="add-subject-btn add-subject" onClick={ this.handleCreateSubject }>Add New Subject</button>
        </div>
      </div>
    </div>
    );

    const subjectsJSX = this.props.subjects.map((subject) => {
      return (
        <SubjectColumn
          key={ `${subject.subjectName}-${subject.teacher}` }
          subject={ subject }
          handleSubjectChange={ this.props.handleSubjectChange }
          deleteSubject={ this.props.deleteSubject }
          isElementaryStudent={ this.props.isElementaryStudent }
          editing={ this.state.editing }
        />
      );
    });

    return (
      <div className="row">
        <div className="col-md-12">
          <span className="edit-subjects">Point Sheet</span>
          {!this.state.editing
            ? <button className="edit-subjects edit-subjects-btn"
              onClick={this.toggleEditing}>
              Edit Subjects
            </button>
            : null }
          { this.state.editing ? addNewSubjectJSX : null }
          <div className="point-table">
            <div className="row-labels">
              <label>Teacher</label>
              <label>Subject</label>
              <label>Periods Missed</label>
              <label>Num. of Stamps</label>
              <label>Num. of Xs</label>
              { this.props.isElementaryStudent ? null : <label>Grade</label> }
            </div>
            { subjectsJSX }
            { this.state.editing  
              ? <button 
                type="submit" 
                className="save-subjects add-subject-btn add-subject"
                onClick={this.saveSubjectTable}>
                Save Subjects
                </button>
              : null }
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
  createSubject: PropTypes.func,
  deleteSubject: PropTypes.func,
  isElementaryStudent: PropTypes.bool,
  myRole: PropTypes.string,
  saveSubjectTable: PropTypes.func,
};
