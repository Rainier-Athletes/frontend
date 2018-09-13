import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './_side-bar.scss';

const mapDispatchToProps = dispatch => ({

});

class Sidebar extends React.Component {
  render() {
    return (
      <nav className="col-md-3 d-none d-md-block sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link disabled sidebar-heading" href="#">
                Student
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Customers
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Reports
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Integrations
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default connect(null, mapDispatchToProps)(Sidebar);
