import React from 'react';
import PropTypes from 'prop-types';
import SubjectColumn from '../subject-column/subject-column';

import './point-tracker-table.scss';

export default function PointTrackerTable(props) {
  const addNewSubjectJSX = (
    <div>
      <h4>Add new subjects</h4>
      <select>
        <option disabled selected>Select Teacher</option>
        {
          props.teachers.map(teacher => (
            <option 
              key={ teacher._id }
              name={ teacher._id }
            >{ `${teacher.firstName} ${teacher.lastName}` }
          </option>
          ))
        }
      </select>
      <input type="text" placeholder="Subject Name"/>
      <button type="button">Add new subject</button>
    </div>
  );
  
  const subjectsJSX = props.subjects.map(subject => (
    <SubjectColumn
    key={ subject.subjectName } 
    label={ subject.subjectName }
    subject={ subject }
    handleSubjectChange={ props.handleSubjectChange }
    getTeacherName={ props.getTeacherName }
    deleteSubject={ props.deleteSubject }
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

PointTrackerTable.propTypes = {
  subjects: PropTypes.array,
  teachers: PropTypes.array,
  handleSubjectChange: PropTypes.func,
  getTeacherName: PropTypes.func,
  deleteSubject: PropTypes.func,
};
