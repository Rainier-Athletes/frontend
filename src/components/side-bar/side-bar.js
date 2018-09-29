import React from 'react';
import PropTypes from 'prop-types';

import './_side-bar.scss';

class Sidebar extends React.Component {
  render() {
    return (
      <nav className="col-md-3 d-md-block sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-title">
              <a className="nav-link disabled sidebar-heading">
                Student
              </a>
            </li>
            {
              this.props.content
            }
          </ul>
        </div>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  content: PropTypes.node,
};

export default Sidebar;
