import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Checkbox,
  Button,
  Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as studentDataActions from '../../actions/student-data';
import LoadingSpinner from '../spinner/spinner';
import * as util from '../../lib/utils';

import './student-data-form.scss';

const emptyStudentData = {
  student: '',
  coaches: [],
  sports: [],
  mentors: [],
  teachers: [],
  family: [],
  gender: '',
  school: [],
  dateOfBirth: '',
  grade: 0,
  synopsisReportArchiveUrl: '',
  googleCalendarUrl: '',
  googleDocsUrl: '',
  synergy: {
    username: '',
    password: '',
  },
};

const mapStateToProps = (state, ownProps) => {
  if (!(state.profile && ownProps.studentId)) return {};

  const student = state.students.find(s => s._id.toString() === ownProps.studentId.toString());
  const mentors = state.profile.filter(p => p.role === 'mentor');
  const coaches = state.profile.filter(p => p.role === 'coach');
  const teachers = state.profile.filter(p => p.role === 'teacher');
  const family = state.profile.filter(p => p.role === 'family');
  const waitingOnSave = state.studentData && state.studentData.waitingOnSave;

  return ({
    student,
    mentors,
    coaches,
    teachers,
    family,
    waitingOnSave,
  });
};

const mapDispatchToProps = dispatch => ({
  fetchStudentData: id => dispatch(studentDataActions.fetchStudentData(id)),
  fetchAllStudentData: () => dispatch(studentDataActions.fetchBulkStudentData()),
  createStudentData: studentData => dispatch(studentDataActions.createStudentData(studentData)),
  updateStudentData: studentData => dispatch(studentDataActions.updateStudentData(studentData)),
  setWaitingOnSave: studentData => dispatch(studentDataActions.setWaitingOnSave(studentData)),
});

class StudentDataForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    if (props.student && props.student.studentData) {
      this.state = props.student.studentData;
    } else {
      const newStudentData = Object.assign({}, emptyStudentData);
      newStudentData.student = props.student;
      this.state = newStudentData;
    }

    this.state.newSchool = false;
    this.state.newSport = false;
    this.state.waitingOnSave = false;
  }


  handleNewSchool = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const newState = Object.assign({}, this.state);

    if (e.target.id.includes('cancel')) {
      newState.newSchool = false;
      newState.school.shift();
    } else if (this.state.newSchool) {
      newState.newSchool = false;
      newState.school.forEach((s) => { s.currentSchool = false; return undefined; });
      newState.school[0].currentSchool = true;
    } else {
      newState.newSchool = true;
      newState.school.unshift({ schoolName: '', currentSchool: true, isElementarySchool: false });
    }

    this.setState(newState);
  }

  handleSchoolChange = (e) => {
    const newState = Object.assign({}, this.state);
    newState.school[0].schoolName = e.target.value;
    this.setState(newState);
  }

  handleIsElementarySchool = () => {
    const newState = Object.assign({}, this.state);
    const currentIsElemState = newState.school.find(s => s.currentSchool).isElementarySchool;
    newState.school.filter(s => s.currentSchool)[0].isElementarySchool = !currentIsElemState;
    this.setState(newState);
  }

  handleTextFieldChange = (e) => {
    this.setState({ ...this.state, [e.target.id]: e.target.value });
  }

  handleNewSport = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const newState = Object.assign({}, this.state);

    if (e.target.id.includes('cancel')) {
      newState.newSport = false;
      newState.sports.shift();
    } else if (this.state.newSport) {
      newState.newSport = false;
      newState.sports.forEach((s) => { s.currentlyPlaying = false; return undefined; });
      newState.sports[0].currentlyPlaying = true;
    } else {
      newState.newSport = true;
      newState.sports.unshift({
        sport: '',
        team: '',
        league: '',
        teamCalendarUrl: 'http://',
        currentlyPlaying: true,
      });
    }

    this.setState(newState);
  }

  handleSportFieldChange = (e) => {
    const newState = Object.assign({}, this.state);
    newState.sports[0][e.target.id] = e.target.value;
    this.setState(newState);
  }

  handleSportStatusChange = (e) => {
    const { id } = e.target;
    const newState = Object.assign({}, this.state);
    const { sports } = newState;
    const sportIdx = parseInt(id, 10);
    sports[sportIdx].currentlyPlaying = !sports[sportIdx].currentlyPlaying;
    this.setState(newState);
  }

  handleGuardianChange = (e) => {
    const { id } = e.target;
    const idx = id.split('-')[2]; // id is _id-n-arrayidx
    const prop = e.target.getAttribute('prop');
    const newState = Object.assign({}, this.state);
    const { family } = newState;
    family[idx][prop] = !family[idx][prop];
    this.setState(newState);
  }

  handleSynergyChange = (e) => {
    const newState = Object.assign({}, this.state);
    const { id } = e.target;
    newState.synergy[id] = id === 'username' ? e.target.value : Buffer.from(e.target.value).toString('base64');
    this.setState(newState);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ waitingOnSave: true }); // react state
    this.props.setWaitingOnSave(this.state); // redux store

    if (this.state._id) { // existing doc, update it
      return this.props.updateStudentData(this.state);
    }
    return this.props.createStudentData(this.state);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.waitingOnSave !== prevProps.waitingOnSave) {
      if (prevProps.waitingOnSave) {
        this.setState({ waitingOnSave: false });
        this.props.onClose();
      }
    }
  }

  FieldGroup = ({
    id,
    label,
    help,
    ...props
  }) => {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  };

  render() {
    if (!this.state) return null;

    // eslint-disable
    const currentSchoolJSX = (
      <FormGroup controlId="current-school">
          <label>Current school</label>
          <h4>{this.state.school.length ? this.state.school.find(s => s.currentSchool).schoolName : 'None'}</h4>
          <p>{ /* eslint-disable */
            this.state.school.length
            ? (this.state.school.find(s => s.currentSchool).isElementarySchool
            ? '(Elementary school)' : '(Middle/high school)')
            : ''
            /* eslint-enable */}</p>
          <Button type="submit" className="submitBtn" id="create-new-school" onClick={this.handleNewSchool}>Create New School</Button>
      </FormGroup>
    );
    // eslint-enable

    const newSchoolFormJSX = (
      <FormGroup controlId="create-new-school-form">
          <this.FieldGroup
            id="new-school"
            type="text"
            label="New school"
            placeholder="Enter student&rsqup;s new school"
            value={this.state.school.length ? this.state.school[0].schoolName : ''}
            onChange={this.handleSchoolChange}
          />
          <Checkbox
            inline
            checked={this.state.school.length ? this.state.school.find(s => s.currentSchool).isElementarySchool : false }
            id="isElementarySchool"
            className="checkbox"
            prop="isElementarySchool"
            onChange={this.handleIsElementarySchool}
            >
            Is elementary school
          </Checkbox>
          <div>
            <Button type="submit" className="submitBtn" id="save-new-school" onClick={this.handleNewSchool}>Save School</Button>
            <Button type="reset" className="cancelBtn" id="cancel-new-school" onClick={this.handleNewSchool}>Cancel</Button>
          </div>
      </FormGroup>
    );

    const newSportFormJSX = (
      <FormGroup controlId="create-new-sport-form">
        <Col md={6}>
          <this.FieldGroup
            id="sport"
            type="text"
            label="Sport (baseball, soccer, etc): "
            placeholder="Enter new sport"
            value={this.state.sports.length ? this.state.sports[0].sport : ''}
            onChange={this.handleSportFieldChange}
          />
        </Col>
        <Col md={6}>
          <this.FieldGroup
            id="team"
            type="text"
            label="Team name: "
            placeholder="Enter new team name"
            value={this.state.sports.length ? this.state.sports[0].team : ''}
            onChange={this.handleSportFieldChange}
          />
        </Col>
        <Col md={6}>
          <this.FieldGroup
            id="league"
            type="text"
            label="League: "
            placeholder="Enter new team&rsquo;s league"
            value={this.state.sports.length ? this.state.sports[0].league : ''}
            onChange={this.handleSportFieldChange}
          />
        </Col>
        <Col md={6}>
          <this.FieldGroup
            id="teamCalendarUrl"
            type="text"
            label="Team Calendar URL: "
            placeholder="Enter link to new team&rsquo;s calendar"
            value={this.state.sports.length ? this.state.sports[0].teamCalendarUrl : ''}
            onChange={this.handleSportFieldChange}
          />
        </Col>
        <br/>
        <Button type="submit" className="submitBtn" id="save-new-sport" onClick={this.handleNewSport}>Save Sport</Button>
        <Button type="reset" className="cancelBtn" id="cancel-new-sport" onClick={this.handleNewSport}>Cancel</Button>
      </FormGroup>
    );

    const currentSportsJSX = (
      <FormGroup controlId="current-sports">
      <label>{this.state.sports.length
        ? 'Sports Teams'
        : 'No Current Sports' }</label>
      <h6>{this.state.sports.length
        ? this.state.sports.map((sport, i) => (
          <FormGroup controlId={`current-sport-${i}`} key={`current-sport-${i}`}>
            <h4>{`${sport.team} (${sport.sport}), ${sport.league} league`}</h4>
            <a href={sport.teamCalendarUrl ? sport.teamCalendarUrl : '#'}
              alt="Team Calendar Url"
              target="_blank"
              rel="noopener noreferrer"
              className="team-calendar-url">
              Calendar
            </a>
            <Checkbox
              checked={this.state.sports[i].currentlyPlaying}
              id={i}
              onChange={this.handleSportStatusChange}
              >
              Currently Playing
            </Checkbox>
          </FormGroup>
        ))
        : null
      }</h6>
      <Button type="submit" className="submitBtn" id="create-new-sport" onClick={this.handleNewSport}>Create New Sport</Button>
      </FormGroup>
    );

    return (
      <div className="modal-backdrop">
        <div className="panel student-data-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title title">Student Profile</h5>
              <button type="button" className="close" onClick={ this.props.onCancel } data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="gender-dob">
                <Col componentClass={ControlLabel} md={6}>
                  <this.FieldGroup
                    id="gender"
                    type="text"
                    label="Gender"
                    placeholder="Enter student&rsquo;s gender"
                    value={this.state.gender ? this.state.gender : ''}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>
                <Col componentClass={ControlLabel} md={6}>
                  <this.FieldGroup
                    id="dateOfBirth"
                    type="date"
                    label="Date of Birth"
                    value={this.state.dateOfBirth ? util.convertDateToValue(this.state.dateOfBirth) : ''}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>

              </FormGroup>
              <FormGroup controlId="school-info">
                <Col componentClass={ControlLabel} md={12}>
                  {this.state.newSchool
                    ? newSchoolFormJSX
                    : currentSchoolJSX
                  }
                </Col>
                <Col componentClass={ControlLabel} md={12}>
                  <this.FieldGroup
                    id="grade"
                    type="text"
                    label="Grade"
                    placeholder="Enter student&rsquo;s grade in school"
                    value={this.state.grade ? this.state.grade : 0}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>
              </FormGroup>
              <Col md={12}>
                {this.state.family.length ? <label>Guardians</label> : null }
                {this.state.family.length
                  ? this.state.family.map((f, i) => (
                    <FormGroup controlId={`guardians-${i}`} key={f.member._id}>
                      {`${f.member.firstName} ${f.member.lastName}:`}
                      <Checkbox
                        inline
                        checked={this.state.family[i].weekdayGuardian}
                        className="checkbox"
                        id={`${f.member._id.toString()}-1-${i}`}
                        prop="weekdayGuardian"
                        onChange={this.handleGuardianChange}
                        >Weekday guardian</Checkbox>
                      <Checkbox
                        inline
                        checked={this.state.family[i].weekendGuardian}
                        className="checkbox"
                        id={`${f.member._id.toString()}-2-${i}`}
                        prop="weekendGuardian"
                        onChange={this.handleGuardianChange}
                        >Weekend guardian</Checkbox>
                    </FormGroup>
                  ))
                  : null
                }
              </Col>
              <FormGroup controlId="sports-info">
                <Col md={12}>
                  {this.state.newSport
                    ? newSportFormJSX
                    : currentSportsJSX
                  }
                </Col>
              </FormGroup>
              <FormGroup controlId="urls">
                <Col md={6}>
                  <this.FieldGroup
                    id="synopsisReportArchiveUrl"
                    key="synopsisReportArchiveUrl"
                    type="text"
                    label="Synopsis Reports Archive URL"
                    placeholder="Enter student&rsquo;s synopsis report archive url"
                    value={this.state.synopsisReportArchiveUrl ? this.state.synopsisReportArchiveUrl : ''}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>
                <Col md={6}>
                  <this.FieldGroup
                    id="googleCalendarUrl"
                    key="googleCalendarUrl"
                    type="text"
                    label="Google Calendar URL"
                    placeholder="Enter student&rsquo;s Google calendar url"
                    value={this.state.googleCalendarUrl ? this.state.googleCalendarUrl : ''}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>
                <Col md={6}>
                  <this.FieldGroup
                    id="googleDocsUrl"
                    key="googleDocsUrl"
                    type="text"
                    label="Google Docs URL"
                    placeholder="Enter student&rsquo;s Google documents url"
                    value={this.state.googleDocsUrl ? this.state.googleDocsUrl : ''}
                    onChange={this.handleTextFieldChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="synergy">
                <Col md={6}>
                  <this.FieldGroup
                    id="username"
                    key="username"
                    type="text"
                    label="Synergy Username"
                    placeholder="Synergy username"
                    value={this.state.synergy.username ? this.state.synergy.username : ''}
                    onChange={this.handleSynergyChange}
                  />
                </Col>
                <Col md={6}>
                  <this.FieldGroup
                    id="password"
                    key="password"
                    type="password"
                    label="Synergy Password"
                    placeholder="Synergy password"
                    value={this.state.synergy.password ? Buffer.from(this.state.synergy.password, 'base64') : ''}
                    onChange={this.handleSynergyChange}
                  />
                </Col>
              </FormGroup>
              <div className="modal-footer">
              {!this.state.waitingOnSave
                ? <Button type="submit" className="btn btn-secondary" id="submit-student-data">Submit</Button>
                : <LoadingSpinner />
              }
              <Button type="reset" className="cancelBtn" id="cancel-student-data" onClick={this.props.onCancel}>Cancel</Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

StudentDataForm.propTypes = {
  student: PropTypes.object,
  mentors: PropTypes.array,
  coaches: PropTypes.array,
  teachers: PropTypes.array,
  family: PropTypes.array,
  history: PropTypes.array,
  updateStudentData: PropTypes.func,
  createStudentData: PropTypes.func,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  setWaitingOnSave: PropTypes.func,
  waitingOnSave: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDataForm);
