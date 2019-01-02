import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

export default function SubjectColumn(props) {
  const handleDelete = () => {
    const { subjectName, teacher } = props.subject;
    props.deleteSubject(subjectName, teacher);
  };

  return (
    <React.Fragment>
      <div className="grid-cell">{ props.subject.subjectName.toLowerCase() !== 'tutorial' 
        ? props.subject.teacher.lastName : '' }</div>
      <div className="grid-cell">{ props.subject.subjectName }</div>
      {
        Object.keys(props.subject.scoring)
          .map((markType, i) => {
            const { excusedDays, stamps, halfStamps } = props.subject.scoring;
            const validScores = props.subject.scoring[markType] !== null && props.subject.scoring[markType] !== ''
              && excusedDays >= 0 ? (stamps + halfStamps) <= (20 - excusedDays * 4) : false;
            return (
              <div className="grid-cell" key={ i }><input
                type="number"
                required
                onChange={ props.handleSubjectChange }
                className={validScores ? 'grid-input' : 'grid-input invalid-scores'}
                name={ `${props.subject.subjectName}-${markType}` }
                value={ props.subject.scoring[markType] === null ? '' : props.subject.scoring[markType]}
              /></div>);
          })
      }
      {props.isElementaryStudent ? null
        : <div className="grid-cell">
        <input
          type="text"
          className={props.subject.grade !== null && props.subject.grade !== '' ? 'grid-input' : 'grid-input invalid-scores'}
          onChange={ props.handleSubjectChange }
          name={ `${props.subject.subjectName}-grade` }
          value={ props.subject.grade }
          required={props.subject.subjectName.toLowerCase() !== 'tutorial'}/>
      </div>}
      <div className={props.editing && props.subject.subjectName.toLowerCase() !== 'tutorial' ? 'grid-cell-delete' : 'grid-cell-hidden'}>
          <button type="button" onClick={ handleDelete }>X</button>
      </div>
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
