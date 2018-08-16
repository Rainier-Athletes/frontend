import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import './table-menu.scss';

export default class TableMenu extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
  <React.Fragment>
  <form className="table-menu">
    <button className="table-menu-btn">Mentors</button>
    <button className="table-menu-btn">Students</button>
  </form>
  </React.Fragment>
    );
  }
}
