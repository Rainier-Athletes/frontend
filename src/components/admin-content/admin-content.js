import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminPickStudent from '../admin-pick-student/admin-pick-student';
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
    });
  }

  handleButtonClick = () => {
    if (this.state.modal) {
      this.setState({ modal: false });
    } else {
      this.setState({ modal: true, show: routes.POINTS_TRACKER_ROUTE });
    }
  }

  render() {
    const name = this.props.myProfile ? this.props.myProfile.firstName : null;

    return (
      <div role="main" className="col-md-8 panel">
        {this.state.show === 'nada' && !this.state.modal ? <h1>Hello { name }</h1> : null }
        {this.state.show === routes.POINTS_TRACKER_ROUTE 
          ? <AdminPickStudent 
            students={this.props.students}
            onChange={this.handleChange} />
          : null 
        }
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
