import React from 'react';
import PropTypes from 'prop-types';
mport { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import './subject-column.scss';

export default function SubjectColumn(props) {
  const { subject, handleSubjectChange, getTeacherName } = props;
  const { subjectName, grade, teacher } = subject;
  const { excusedDays, stamps, halfStamps } = subject.scoring;
  
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
        type="submit"
        // onClick={  } TODO {ADD DELETE HANDLER
      ><FontAwesomeIcon icon={f2ed} />
      </button> 
    </div>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
  getTeacherName: PropTypes.func,
};
