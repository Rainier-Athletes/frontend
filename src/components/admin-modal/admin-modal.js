import React from 'react';
import PropTypes from 'prop-types';//eslint-disable-line
import * as routes from '../../lib/routes';//eslint-disable-line

import './admin-modal.scss';

export default class AdminModal extends React.Component {
  renderModal() {
  }

  render() {
    return (
      <div className="modalContainer">
        <form className="modal">
          <h1>Add A Mentor</h1>
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
          
          <div className="field-wrap">
            <input type="role"required placeholder="Role*"/>
          </div>
          
          <div className="btn-container"><button type="submit" className="enter">ADD MENTOR</button></div>
        <div className="admin-mentor-btn">
          <button type="submit" className="enter-admin">ENTER AS ADMIN</button>
          <button type="submit" className="enter-mentor">ENTER AS MENTOR</button>
        </div>
        </form>
      </div>
    );
  }
}
