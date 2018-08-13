import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default class PointTrackerForm extends React.Component {
  // const renderRow = () => ()

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
            <table>
              <thead>
                <tr>
                  <td>.</td>
                  <td>Period 1</td>
                  <td>Period 2</td>
                  <td>Period 3</td>
                  <td>Period 4</td>
                  <td>Period 5</td>
                  <td>Period 6</td>
                  <td>Period 7</td>
                  <td>Tutorial / Check-in</td>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>Synopsis</legend>
            <label htmlFor="student-action-items">Student Action Items</label>
            <textarea id="student-action-items"/>
          </fieldset>
        </form>
      </React.Fragment>
    );
  }
}
