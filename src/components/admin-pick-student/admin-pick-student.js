import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PointTrackerForm from '../point-tracker-form/point-tracker-form';

import './admin-pick-student.scss';

const mapStateToProps = state => ({
  students: state.students,
  // pointTrackers: state.pointTrackers,
});

class AdminPickStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: undefined,
      modal: false,
    };
  }

  componentDidUpdate = () => {
    // update state.content if corresponding props.student data has updated
    const { content } = this.state;
    if (content.studentData.lastPointTracker.updatedAt 
      < this.props.students.find(s => s._id.toString() === content._id.toString()).studentData.lastPointTracker.updatedAt) {
      this.setState({ content: this.props.students.find(s => s._id.toString() === content._id.toString()) });
    }
  }

  handleChange = (e) => {
    this.setState({
      content: this.props.students.find(s => s._id.toString() === e.target.value),
    });
  }

  handleButtonClick = () => {
    if (Object.keys(this.state.content).length > 0) {
      this.setState({ modal: !this.state.modal });
    }
  }

  render() {
    return (
    <div className="container pick-student">
      {
        this.state.modal ? <PointTrackerForm content={ this.state.content } buttonClick={ this.handleButtonClick } /> : null
      }
      <button type="submit" className="linkToPT" onClick={ this.handleButtonClick }>
          Point Tracker
      </button>
      <form onChange={ this.handleChange }>
        <div className="field-wrap dropdown">
            <select type="student" required>
              <option value="" selected="true" disabled> -- select a student -- </option>
              {
                this.props.students
                  .filter(s => s.studentData) // only show students with defined studentData object
                  .sort((p1, p2) => {
                    if (p1.lastName > p2.lastName) return 1;
                    if (p1.lastName < p2.lastName) return -1;
                    return 0;
                  })
                  .map((p) => {
                    return <option key={p._id} value={p._id}>
                      {p.lastName}, {p.firstName}
                    </option>;
                  })
              }
            </select>
        </div>
        <br />
        <div>
          Note: Only students with associated student data are listed.
        </div>

      </form>
    </div>
    );
  }
}

AdminPickStudent.propTypes = {
  onChange: PropTypes.func,
  students: PropTypes.array,
};

export default connect(mapStateToProps)(AdminPickStudent);
