import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Checkbox,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as studentDataActions from '../../actions/student-data';

import './student-data-form.scss';

const emptyStudentData = {
  student: '',
  // lastPointTracker: '',
  coaches: [],
  sports: [],
  mentors: [],
  teachers: [],
  family: [],
  gender: '',
  school: [],
  dateOfBirth: undefined,
  grade: undefined,
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

  return ({
    student,
    mentors,
    coaches,
    teachers,
    family,
  });
};

const mapDispatchToProps = dispatch => ({
  fetchStudentData: id => dispatch(studentDataActions.fetchStudentData(id)),
  fetchAllStudentData: () => dispatch(studentDataActions.fetchBulkStudentData()),
  createStudentData: studentData => dispatch(studentDataActions.createStudentData(studentData)),
  updateStudentData: studentData => dispatch(studentDataActions.updateStudentData(studentData)),
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
    // new school is school[0]
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
    // e.preventDefault();
    console.log(e.target.id, e.target.value);
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
        currentlyPlaying: true,
      });
    }

    this.setState(newState);
  }

  handleSportFieldChange = (e) => {
    const newState = Object.assign({}, this.state);
    // new sport is sports[0]
    newState.sports[0][e.target.id] = e.target.value;
    this.setState(newState);
  }

  handleSportStatusChange = (e) => {
    const { id } = e.target;
    const newState = Object.assign({}, this.state);
    const { sports } = newState;
    const sportIdx = parseInt(id, 10);
    console.log(sports, id, sportIdx);
    sports[sportIdx].currentlyPlaying = !sports[sportIdx].currentlyPlaying;
    this.setState(newState);
  }

  handleGuardianChange = (e) => {
    const { id } = e.target;
    const prop = e.target.getAttribute('prop');
    const newState = Object.assign({}, this.state);
    const { family } = newState;
    const memberIdx = family.map(m => m.member._id).indexOf(id);
    family[memberIdx][prop] = !family[memberIdx][prop];
    this.setState(newState);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.id.indexOf('new-school') > -1) return this.handleNewSchool(e);

    if (this.state._id) { // existing doc, update it
      return this.props.updateStudentData(this.state);
    }
    return this.props.createStudentData(this.state);
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
      <h5>Current school:</h5>
      <h6>{this.state.school.length ? this.state.school.find(s => s.currentSchool).schoolName : 'None'}</h6>
      <h6>{ /* eslint-disable */
        this.state.school.length
        ? (this.state.school.find(s => s.currentSchool).isElementarySchool
        ? 'An elementary school' : 'A middle/high school')
        : ''
        /* eslint-enable */}</h6>
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
          placeholder="Enter student's new school"
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
          Check if elementary school
        </Checkbox>
        <p><Button type="submit" className="submitBtn" id="save-new-school" onClick={this.handleNewSchool}>Save School</Button></p>
        <p><Button type="reset" className="cancelBtn" id="cancel-new-school" onClick={this.handleNewSchool}>Cancel</Button></p>
      </FormGroup>
    );

    const newSportFormJSX = (
      <FormGroup controlId="create-new-sport-form">
        <this.FieldGroup
          id="sport"
          type="text"
          label="Sport (baseball, soccer, etc): "
          placeholder="Enter new sport"
          value={this.state.sports.length ? this.state.sports[0].sport : ''}
          onChange={this.handleSportFieldChange}
        />
        <this.FieldGroup
          id="team"
          type="text"
          label="Team name: "
          placeholder="Enter new team name"
          value={this.state.sports.length ? this.state.sports[0].team : ''}
          onChange={this.handleSportFieldChange}
        />
        <this.FieldGroup
          id="league"
          type="text"
          label="League: "
          placeholder="Enter new team&rsquo;s league"
          value={this.state.sports.length ? this.state.sports[0].league : ''}
          onChange={this.handleSportFieldChange}
        />
        <p><Button type="submit" className="submitBtn" id="save-new-sport" onClick={this.handleNewSport}>Save Sport</Button></p>
        <p><Button type="reset" className="cancelBtn" id="cancel-new-sport" onClick={this.handleNewSport}>Cancel</Button></p>
      </FormGroup>
    );

    const currentSportsJSX = (
      <FormGroup controlId="current-sports">
      <h4>{this.state.sports.length
        ? 'Sports Teams'
        : 'No Current Sports' }</h4>
      <h6>{this.state.sports.length
        ? this.state.sports.map((sport, i) => (
          <FormGroup controlId={`current-sport-${i}`} key={`current-sport-${i}`}>
          {`${sport.team} (${sport.sport}), ${sport.league} league`}
          <Checkbox
            inline
            checked={this.state.sports[i].currentlyPlaying}
            className="checkbox"
            id={i}
            onChange={this.handleSportStatusChange}
            >Currently playing</Checkbox>
          </FormGroup>
        ))
        : null
      }</h6>
      <Button type="submit" className="submitBtn" id="create-new-sport" onClick={this.handleNewSport}>Create New Sport</Button>
      </FormGroup>
    );

    return (
      <div className="student-data-form">
        <button className="close-modal" onClick={this.props.onClose}>x</button>
        <h2 className="studentModalHeader">Student Profile Data for {this.state.student.firstName} {this.state.student.lastName}</h2>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="gender-dob">
            <this.FieldGroup
              id="gender"
              type="text"
              label="Gender"
              placeholder="Enter student&rsquo;s gender"
              value={this.state.gender ? this.state.gender : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="dateOfBirth"
              type="text"
              label="Date of Birth"
              value={this.state.dateOfBirth ? this.state.dateOfBirth : ''}
              onChange={this.handleTextFieldChange}
            />
          </FormGroup>
          <FormGroup controlId="school-info">
          {this.state.newSchool
            ? newSchoolFormJSX
            : currentSchoolJSX
          }
            <this.FieldGroup
              id="grade"
              type="text"
              label="Grade"
              placeholder="Enter student's grade in school"
              value={this.state.grade ? this.state.grade : ''}
              onChange={this.handleTextFieldChange}
            />
          </FormGroup>
          {this.state.family.length ? <h4>Guardians</h4> : null }
          {this.state.family.length
            ? this.state.family.map((f, i) => (
              <FormGroup controlId={`guardians-${i}`} key={f.member._id}>
                {`${f.member.firstName} ${f.member.lastName}:`}
                <Checkbox
                  inline
                  checked={this.state.family[i].weekdayGuardian}
                  className="checkbox"
                  id={f.member._id.toString()}
                  prop="weekdayGuardian"
                  onChange={this.handleGuardianChange}
                  >Weekday guardian</Checkbox>
                <Checkbox
                  inline
                  checked={this.state.family[i].weekendGuardian}
                  className="checkbox"
                  id={f.member._id.toString()}
                  prop="weekendGuardian"
                  onChange={this.handleGuardianChange}
                  >Weekend guardian</Checkbox>
              </FormGroup>
            ))
            : null
          }
          <FormGroup controlId="sports-info">
            {this.state.newSport
              ? newSportFormJSX
              : currentSportsJSX
            }
          </FormGroup>
          <FormGroup controlId="urls">
            <this.FieldGroup
              id="synopsisReportArchiveUrl"
              key="synopsisReportArchiveUrl"
              type="text"
              label="Synopsis Reports Archive URL"
              placeholder="Enter student&rsquo;s synopsis report archive url"
              value={this.state.synopsisReportArchiveUrl ? this.state.synopsisReportArchiveUrl : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="googleCalendarUrl"
              key="googleCalendarUrl"
              type="text"
              label="Google Calendar URL"
              placeholder="Enter student&rsquo;s Google calendar url"
              value={this.state.googleCalendarUrl ? this.state.googleCalendarUrl : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="googleDocsUrl"
              key="googleDocsUrl"
              type="text"
              label="Google Docs URL"
              placeholder="Enter student&rsquo;s Google documents url"
              value={this.state.googleDocsUrl ? this.state.googleDocsUrl : ''}
              onChange={this.handleTextFieldChange}
            />
          </FormGroup>
          <Button type="submit" className="formSubmitBtn" id="submit-student-data">Submit</Button>
          <Button type="reset" className="cancelBtn" id="cancel-student-data" onClick={this.props.onClose}>Cancel</Button>
        </form>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDataForm);
