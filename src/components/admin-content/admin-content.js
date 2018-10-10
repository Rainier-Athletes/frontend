import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import AdminTable from '../admin-table/admin-table';
import * as routes from '../../lib/routes';

// import Navbar from '../navbar/navbar';
// import AdminUser from '../app/app';
// import Auth from '../auth/auth';

import './_admin-content.scss';

const mapStateToProps = state => ({
  myProfile: state.myProfile,
  loggedIn: !!state.token,
  profiles: state.profile,
});

// const name = Auth(['admin']);

class AdminContent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: null,
    };
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      console.log('admin content props.show', this.props.show);
      this.setState({ show: this.props.show });
    }
  }

  handleChange = (e) => {
    const { selectedIndex } = e.target.options;
    console.log('content change selectedIndex', selectedIndex);
    console.log('content chagne options @', e.target.options[selectedIndex]);
    /*
    if (e.target.getAttribute('type') === 'student') {
      query.student = e.target.value;
      this.setState({ query });
    } else if (e.target.getAttribute('type') === 'role') {
      this.setState({ ...this.state, role: e.target.value });
    } else {
      if (query.mentor || query.admin || query.teacher || query.coach || query.family) {
        const key = Object.keys(query).filter(p => p !== 'student');
        delete query[key];
      }
      query[e.target.options[selectedIndex].getAttribute('role')] = e.target.value;
      this.setState({ query });
    }
    */
  }

  render() {
    console.log('admin content props.show', this.props.show);
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
        <h1>Hello { name }</h1>
        {this.props.show === routes.POINTS_TRACKER_ROUTE ? pickStudentJSX : null }
      </div>
    );
  }
}

AdminContent.propTypes = {
  myProfile: PropTypes.object,
  show: PropTypes.string,
  students: PropTypes.array,
};

export default connect(mapStateToProps, null)(AdminContent);
