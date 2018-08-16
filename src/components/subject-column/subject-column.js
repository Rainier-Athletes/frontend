import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const { subject, handleSubjectChange, getTeacherName, deleteSubject } = props;
  const { subjectName, grade, teacher } = subject;
  const { excusedDays, stamps, halfStamps } = subject.scoring;

  const handleDelete = () => {
    deleteSubject(subjectName, teacher);
  };
  
  return (
    <div className="column data">
      <label>{ getTeacherName(teacher) }</label>
      <label>{ subjectName }</label>
      <input 
        type="number" 
        onChange={ handleSubjectChange } 
        name={ `${subjectName}-excusedDays` }
        value={ excusedDays }
      />
      <input 
        type="number" 
        onChange={ handleSubjectChange } 
        name={ `${subjectName}-stamps` }
        value={ stamps }
      />
      <input 
        type="number" 
        onChange={ handleSubjectChange } 
        name={ `${subjectName}-x` }
        value={ halfStamps }
      />
      <input 
        type="number"
        onChange={ handleSubjectChange } 
        name={ `${subjectName}-grade` }
        value={ grade }
      />
      <button 
        type="button"
        onClick={ handleDelete }
      >X</button> 
    </div>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
  getTeacherName: PropTypes.func,
  deleteSubject: PropTypes.func,
};
