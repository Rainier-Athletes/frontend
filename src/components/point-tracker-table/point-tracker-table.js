import React from 'react';
import PropTypes from 'prop-types';
import SubjectColumn from '../subject-column/subject-column';

import './point-tracker-table.scss';

export default function PointTrackerTable(props) {
  const subjects = props.subjects.map(subject => (
    <SubjectColumn 
    key={ subject.subjectName } 
    label={ subject.subjectName }
    subject={ subject }
    handleSubjectChange={ props.handleSubjectChange }
    />
  ));
  
  return (
    <React.Fragment>
      <legend>Point Sheet and Grades</legend>
      <div className="point-table">
        <div className="row-labels">
          <label></label>
          <label>Periods Missed</label>
          <label>Num. of Stamps</label>
          <label>Num. of Xs</label>
          <label>Grade</label>
        </div>
        { subjects }
      </div>
      </React.Fragment>
  );
}

PointTrackerTable.propTypes = {
  handleSubjectChange: PropTypes.func,
  subjects: PropTypes.array,
};
