import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const { subject, handleChange } = props;
  const { subjectName } = subject;
  const { excusedDays, stamps, x } = subject.scoring;
  
  return (
    <div className="column data">
      <label>{ subject.subjectName }</label>
      <input 
        type="number" 
        onChange={ handleChange } 
        name={ `${subjectName}-excusedDays` }
        value={ excusedDays }
      />
      <input 
        type="number" 
        onChange={ handleChange } 
        name={ `${subjectName}-stamps` }
        value={ stamps }
      />
      <input 
        type="number" 
        onChange={ handleChange } 
        name={ `${subjectName}-x` }
        value={ x }
      />
      <input 
        type="number" 
        onChange={ handleChange } 
        name={ `${subjectName}-grade` }
      />
    </div>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleChange: PropTypes.func,
};
