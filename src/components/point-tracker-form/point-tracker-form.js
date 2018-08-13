import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PointTrackerTable from '../point-tracker-table/point-tracker-table';

export default class PointTrackerForm extends React.Component {
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
          <h4>Point Sheet and Grades</h4>
        <form className="data-entry">
          <div>
            <PointTrackerTable/>
          </div>

          <div className="synopsis">
            <h4>Synopsis</h4>
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
            <option value="3">Three quarters</option>
            <option value="4">Two quarters</option>
            <option value="5">One quarter</option>
            <option value="6">None of game</option>
          </select>
          <textarea id="playtime-comments" placeholder="Please explain..." />
          </div>
          <button type="submit">Preview</button>
        </form>
      </React.Fragment>
    );
  }
}
