import React from 'react';
import PropTypes from 'prop-types';

import './point-tracker-table.scss';

class PeriodColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = '';
  }
  
  render() {
    return (
      <div className="column">
        <label>{ this.props.label }</label>
        <input type="number"/>
        <input type="number"/>
        <input type="number"/>
        <input type="number"/>
      </div>
    );
  }
}

export default class PointTrackerTable extends React.Component {
  render() {
    return (
      <div className="point-table">
        <div className="column labels">
          <label></label>
          <label>Periods Missed</label>
          <label>Num. of Stamps</label>
          <label>Num. of Xs</label>
          <label>Grade</label>
        </div>
        <PeriodColumn label="Period 1"/>
        <PeriodColumn label="Period 2"/>
        <PeriodColumn label="Period 3"/>
        <PeriodColumn label="Period 4"/>
        <PeriodColumn label="Period 5"/>
        <PeriodColumn label="Period 6"/>
        <PeriodColumn label="Period 7"/>
        <PeriodColumn label="Tutorial"/>
      </div>
    );
  }
}

PeriodColumn.propTypes = {
  label: PropTypes.string,
};
