import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  students: state.students,
});

class AdminPickStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e) => {
    const modal = !this.state.modal;
    this.setState({
      content: this.props.students.find(s => s._id.toString() === e.target.value),
      modal,
    });
  }

  render() {
    return (
    <form onChange={this.props.onChange}>
      <div className="field-wrap dropdown">
        <label className="title" htmlFor="student">Select student:</label>
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
      <div>
        Note: Only students with associated student data are listed.
      </div>
    </form>
    );
  }
}

AdminPickStudent.propTypes = {
  onChange: PropTypes.func,
  students: PropTypes.array,
};

export default connect(mapStateToProps)(AdminPickStudent);
