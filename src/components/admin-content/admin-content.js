import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PointTrackerForm from '../point-tracker-form/point-tracker-form';
import AdminExtract from '../admin-extract/admin-extract';
import * as routes from '../../lib/routes';

import './_admin-content.scss';

const mapStateToProps = state => ({
  myProfile: state.myProfile,
  students: state.students,
});

class AdminContent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: 'nada',
      content: undefined,
      modal: false,
    };
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.setState({ show: this.props.show, csvFileSaved: false });
    }
  }

  componentDidMount = () => {
    this.setState({ csvFileSaved: false, waitingOnSave: false });
  }

  handleChange = (e) => {
    const modal = !this.state.modal;
    this.setState({ 
      content: this.props.students.find(s => s._id.toString() === e.target.value),
      modal,
      show: 'nada',
    });
  }

  handleButtonClick = () => {
    if (this.state.modal) {
      this.setState({ modal: false, show: 'nada' });
    } else {
      this.setState({ modal: true, show: routes.POINTS_TRACKER_ROUTE });
    }
  }

  render() {
    const name = this.props.myProfile ? this.props.myProfile.firstName : null;

    const pickStudentJSX = (
      <form onChange={this.handleChange}>
        <div className="field-wrap dropdown">
          <label className="title" htmlFor="student">Select student:</label>
            <select type="student" required>
              <option value="" selected="true" disabled> -- select a student -- </option>
              {
                this.props.students
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
      </form>
    );

    return (
      <div role="main" className="col-md-8 panel">
        {this.state.show === 'nada' && !this.state.modal ? <h1>Hello { name }</h1> : null }
        {this.state.show === routes.POINTS_TRACKER_ROUTE ? pickStudentJSX : null }
        {
          this.state.modal ? <PointTrackerForm content={ this.state.content } buttonClick={ this.handleButtonClick } /> : null
        }
        {this.state.show === routes.EXTRACT_CSV_ROUTE ? <AdminExtract /> : null }
      </div>
    );
  }
}

AdminContent.propTypes = {
  myProfile: PropTypes.object,
  show: PropTypes.string,
  students: PropTypes.array,
};

export default connect(mapStateToProps)(AdminContent);
