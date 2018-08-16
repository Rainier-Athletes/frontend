import React from 'react';
import PropTypes from 'prop-types';//eslint-disable-line
import * as routes from '../../lib/routes';//eslint-disable-line

import './connection-modal.scss';

export default class ConnectionModal extends React.Component {
  render() {
    return (
      <div className="modalContainer">
        <form className="modal">
          <h1>Add A Connection</h1>
          <div className="top-row">
            <div className="field-wrap">
              <input type="text" required placeholder="First Name*" />
            </div>
        
            <div className="field-wrap">
              <input type="text"required placeholder="Last Name*"/>
            </div>
          </div>

          <div className="field-wrap">
            <input type="email"required placeholder="Email*"/>
          </div>
          
          <div className="field-wrap role-dropdown">
            <select type="role" required placeholder="Role*">
              <option value="mentor">Mentor</option>
              <option value="teacher">Teacher</option>
              <option value="coach">Coach</option>
            </select>
          </div>
        <div className="addButton-container">
          <button type="submit" className="addButton">Add Person</button>
        </div>
        </form>
      </div>
    );
  }
}
