import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from '../side-bar/side-bar';
import MentorContent from '../mentor-content/mentor-content';
import PointTrackerForm from '../point-tracker-form/point-tracker-form';


import * as profileActions from '../../actions/profile';
import './_mentor.scss';

const mapStateToProps = state => ({
  myStudents: state.myStudents,
  myProfile: state.myProfile,
});

const mapDispatchToProps = dispatch => ({
  fetchMyStudents: profile => dispatch(profileActions.fetchMyStudentsReq(profile)),
});

class Mentor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
      modal: false,
      selected: -1,
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
      this.setState({
        ...this.state,
        content: this.props.myStudents[i],
        selected: i,
      });
    }
  }

  fetchStudents() {
    if (this.props.myStudents) {
      return this.props.myStudents.map((student, i) => {
        return (
          <li
            className={ this.state.selected === (i + 1).toString() ? 'nav-item selected' : 'nav-item' }
            key={student._id}
            data-index={i + 1}
            onClick={ this.handleSidebarClick.bind(this) }>
            <a className="nav-link">
              { student.firstName } { student.lastName }
            </a>
          </li>
        );
      });
    }

    return 'loading';
  }

  checkRole() {
    if (this.props.myProfile.role === 'admin') {
      return (
        <React.Fragment>
        <hr />
        <li
          className={ this.state.selected === 0 ? 'nav-item selected' : 'nav-item' }
          data-index={0}
          onClick={ this.handleSidebarClick.bind(this) }>
          <a className="nav-link">
            Fill Point Tracker as Substitute
          </a>
        </li>
        </React.Fragment>
      );
    }

    return null;
  }

  handleButtonClick = () => {
    if (this.state.modal) {
      this.setState({ modal: false });
    } else {
      this.setState({ modal: true });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
          <Sidebar content={ this.fetchStudents() } role={ this.checkRole() }/>
          <MentorContent content={ this.state.content } buttonClick={ this.handleButtonClick }>
            {
              this.state.modal ? <PointTrackerForm content={ this.state.content } buttonClick={ this.handleButtonClick } /> : null
            }
          </ MentorContent>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Mentor.propTypes = {
  fetchMyStudents: PropTypes.func,
  myStudents: PropTypes.array,
  myProfile: PropTypes.object,
};


export default connect(mapStateToProps, mapDispatchToProps)(Mentor);
