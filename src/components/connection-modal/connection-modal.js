import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as routes from '../../lib/routes';//eslint-disable-line
import * as relationshipActions from '../../actions/relationship';

import './connection-modal.scss';

const mapStateToProps = state => ({
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  setRelationship: profiles => dispatch(relationshipActions.setRelationshipReq(profiles)),
});

const query = {
  student: '',
};

class ConnectionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {},
    };
  }

  handleSubmit = () => {
    this.props.setRelationship(this.state.query);
  }

  handleChange = (e) => {
    const { selectedIndex } = e.target.options;

    if (e.target.getAttribute('type') === 'student') {
      query.student = e.target.value;
      this.setState({ query });
    } else {
      if (query.mentor || query.admin || query.teacher || query.coach || query.family) {
        const key = Object.keys(query).filter(p => p !== 'student');
        delete query[key];
      }
      query[e.target.options[selectedIndex].getAttribute('role')] = e.target.value;
      this.setState({ query });
    }
  }

  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modalContainer">
        <form onChange={this.handleChange}>
          <button className="close-modal" onClick={this.props.onClose}>X</button>
          <h1>Add A Connection</h1>
          <div className="field-wrap dropdown">
            <label htmlFor="student">Student Name:</label>
              <select type="student" required>
                <option disabled selected value> -- select an option -- </option>
                {
                  this.props.profile.filter(p => p.role === 'student').map((p) => {
                    return <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName}
                      </option>;
                  })
                }
              </select>
          </div>
          <div className="field-wrap dropdown">
            <label htmlFor="connection-name">Name Of Connection:</label>
              <select type="connection-name" required>
                <option disabled selected value> -- select an option -- </option>
                {
                  this.props.profile.filter(p => p.role !== 'student').map((p) => {
                    return <option key={p._id} value={p._id} role={p.role}>
                        {p.firstName} {p.lastName} - {p.role}
                      </option>;
                  })
                }
              </select>
          </div>
        <div className="addButton-container">
          <button type="submit" className="addButton" onClick={this.handleSubmit}>Add Connection</button>
        </div>
        </form>
      </div>
    );
  }
}

ConnectionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  profile: PropTypes.array,
  setRelationship: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionModal);
