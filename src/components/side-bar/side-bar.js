import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as profileActions from '../../actions/profile';
import './_side-bar.scss';

const mapStateToProps = state => ({
  myStudents: state.myStudents,
});

const mapDispatchToProps = dispatch => ({
  fetchMyStudents: profile => dispatch(profileActions.fetchMyStudentsReq(profile)),
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myStudents: [],
    };
  }

  static getDerivedStateFromProps = (nextProps) => {
    if (nextProps.myStudents) {
      return { myStudents: nextProps.myStudents };
    }

    return null;
  }

  fetchStudents() {
    if (this.props.myStudents) {
      return this.props.myStudents.map((student) => {
        return (
          <li className="nav-item" key={student._id}><a className="nav-link" href="#">
              {
                student.firstName
              }
            </a>
          </li>
        );
      });
    }

    return undefined;
  }

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
            {
              this.fetchStudents()
            }
          </ul>
        </div>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  myStudents: PropTypes.array,
  fetchMyStudents: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
