import React from 'react';
import PropTypes from 'prop-types';

import './point-tracker-table.scss';

class PeriodColumn extends React.Component {
  render() {
    return (
      <div className="column">
        <label>{ this.props.label }</label>
        <input type="number" onChange={ this.props.handleChange } name={ `${this.props.label}-excusedDays` }/>
        <input type="number" onChange={ this.props.handleChange } name={ `${this.props.label}-stamps` }/>
        <input type="number" onChange={ this.props.handleChange } name={ `${this.props.label}-x` }/>
        <input type="number" onChange={ this.props.handleChange } name={ `${this.props.label}-grade` }/>
      </div>
    );
  }
}

PeriodColumn.propTypes = {
  label: PropTypes.string,
  handleChange: PropTypes.func,
};

export default class PointTrackerTable extends React.Component {
  render() {
    const subjects = this.props.subjects.map(subject => (
      <PeriodColumn 
        key={ subject.subjectName } 
        label={ subject.subjectName } 
        handleChange={ this.props.handleChange }
      />
    ));

    return (
      <div className="point-table">
        <div className="column labels">
          <label></label>
          <label>Periods Missed</label>
          <label>Num. of Stamps</label>
          <label>Num. of Xs</label>
          <label>Grade</label>
        </div>
        { subjects }
        <PeriodColumn label="Tutorial" />
      </div>
    );
  }
}

PointTrackerTable.propTypes = {
  handleChange: PropTypes.func,
  subjects: PropTypes.array,
};
