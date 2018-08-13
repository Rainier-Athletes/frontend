import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default class PointTrackerForm extends React.Component {
  // const renderRow = () => ()
  renderPeriodColumn = () => {
    return (
      <div className="period">
        <label>Period</label>
        <input type="number"/>
        <input type="number"/>
        <input type="number"/>
        <input type="number"/>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <h1>Hello from mentor landing</h1>
        <form className="selection-menu">
          <label htmlFor="">Select Student</label>
          <select>
            <option value="1">example student 1</option>
            <option value="2">example student 2</option>
          </select>
          <label htmlFor="">Select Date</label>
          <input id="date" type="date"/>
          <button type="submit">Create New Report</button>
        </form>
        <form className="data-entry">
          <fieldset>
            <legend>Point Sheet and Grades</legend>
            <label></label>
            <label>Periods Missed</label>
            <label>Num. of Stamps</label>
            <label>Num. of Xs</label>
            <label>Grade</label>
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
            { this.renderPeriodColumn() }
          </fieldset>
          <fieldset>

          </fieldset>

          <fieldset>
            <legend>Synopsis</legend>
            <label htmlFor="student-action-items">Student Action Items</label>
            <textarea id="student-action-items"/>

            <label htmlFor="sports-update">Sports Update</label>
            <textarea id="sports-update"/>

            <label htmlFor="additional-comments">Additional Comments</label>
            <textarea id="additional-comments"/>

            <label htmlFor="">Playing Time Earned</label>
          <select>
            <option value="" disabled defaultValue>Select Playing Time</option>
            <option value="1">Entire Game</option>
            <option value="2">All but start</option>
            <option value="1">Three quarters</option>
            <option value="2">Two quarters</option>
            <option value="1">One quarter</option>
            <option value="2">None of game</option>
          </select>
          <textarea id="playtime-comments" placeholder="Please explain..." />
          </fieldset>
          <button type="submit">Preview</button>
        </form>
      </React.Fragment>
    );
  }
}
