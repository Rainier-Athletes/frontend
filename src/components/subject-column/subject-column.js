import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const handleDelete = () => {
    const { subjectName, teacher } = props.subject;
    props.deleteSubject(subjectName, teacher);
  };

  return (
    // <div className="column data">
    <React.Fragment>
      <div>{ props.subject.subjectName.toLowerCase() !== 'tutorial' 
        ? props.subject.teacher.lastName : '' }</div>
      <div>{ props.subject.subjectName }</div>
      {
        Object.keys(props.subject.scoring)
          .map((markType, i) => {
            const { excusedDays, stamps, halfStamps } = props.subject.scoring;
            const validScores = excusedDays ? (stamps + halfStamps) <= (20 - excusedDays * 4) : true;
            return (
              <div key={ i }><input
                type="number"
                required
                onChange={ props.handleSubjectChange }
                className={validScores ? '' : 'invalid-scores'}
                name={ `${props.subject.subjectName}-${markType}` }
                value={ props.subject.scoring[markType] === null ? '' : props.subject.scoring[markType]}
              /></div>);
          })
      }
      {props.isElementaryStudent
        ? <div></div>
        : <div><input
          type="text"
          onChange={ props.handleSubjectChange }
          name={ `${props.subject.subjectName}-grade` }
          value={ props.subject.grade }
          required={props.subject.subjectName.toLowerCase() !== 'tutorial'}
        /></div>}
      {/* { props.editing
        ? <button type="button" onClick={ handleDelete }>x</button>
        : null } */}
      {/* </div> */}
    </React.Fragment>
  );
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
  deleteSubject: PropTypes.func,
  isElementaryStudent: PropTypes.bool,
  editing: PropTypes.bool,
};
