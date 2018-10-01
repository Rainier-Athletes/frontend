import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from '../side-bar/side-bar';
import MentorContent from '../mentor-content/mentor-content';


import * as profileActions from '../../actions/profile';
import './_mentor.scss';

const mapStateToProps = state => ({
  myStudents: state.myStudents,
});

const mapDispatchToProps = dispatch => ({
  fetchMyStudents: profile => dispatch(profileActions.fetchMyStudentsReq(profile)),
});

class Mentor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  static getDerivedStateFromProps = (nextProps) => {
    if (nextProps.myStudents) {
      return { myStudents: nextProps.myStudents };
    }

    return null;
  }

  componentDidMount = () => {
    this.props.fetchMyStudents();
  }

  handleSidebarClick(e) {
    const i = e.currentTarget.dataset.index;

    if (this.props.myStudents[i].role === 'student') {
      this.setState({ content: this.props.myStudents[i] });
    }
  }

  fetchStudents() {
    if (this.props.myStudents) {
      return this.props.myStudents.map((student, i) => {
        return (
          <li className="nav-item" key={student._id} data-index={i} onClick={ this.handleSidebarClick.bind(this) }><a className="nav-link">
              { student.firstName } { student.lastName }
            </a>
          </li>
        );
      });
    }

    return 'loading';
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <Sidebar content={ this.fetchStudents() }/>
          <MentorContent content={ this.state.content }/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Mentor.propTypes = {
  fetchMyStudents: PropTypes.func,
  myStudents: PropTypes.array,
};


export default connect(mapStateToProps, mapDispatchToProps)(Mentor);
