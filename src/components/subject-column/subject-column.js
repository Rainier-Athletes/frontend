import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const { subject, handleSubjectChange } = props;
  const { subjectName } = subject;
  const { excusedDays, stamps, x } = subject.scoring;
  
  return (
    <div className="column data">
      <label className="column-rows">{ subject.subjectName }</label>
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
        value={ x }
      />
      <input 
        type="number" 
        onChange={ handleSubjectChange } 
        name={ `${subjectName}-grade` }
      />
    </div>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
};
