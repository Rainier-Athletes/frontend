import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const { subject, handleSubjectChange } = props;
  const { subjectName, grade } = subject;
  const { excusedDays, stamps, halfStamps } = subject.scoring;
  
  return (
    <div className="column data">
      <label>{ subject.subjectName }</label>
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
    </div>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
};
