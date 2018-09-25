import React from 'react';
import {
  FormGroup, 
  ControlLabel, 
  FormControl,
  HelpBlock,
  Checkbox,
  Radio,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './student-data-form.scss';

const emptyStudentData = {
  student: '',
  lastPointTracker: '',
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

  handleGuardianChange = (e) => {
    const { id } = e.target;
    const prop = e.target.getAttribute('prop');
    console.log(id, prop);
    const newState = Object.assign({}, this.state);
    const { family } = newState;
    const memberIdx = family.map(m => m.member._id).indexOf(id);
    family[memberIdx][prop] = !family[memberIdx][prop];
    this.setState(newState);
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

    return (
      <div className="student-data-form">
        <h1>Student Profile Data for {this.state.student.firstName} {this.state.student.lastName}</h1>
        <form>
          <FormGroup controlId="gender-dob">
            <this.FieldGroup
              id="gender"
              type="text"
              label="Gender"
              placeholder="Enter student's gender"
              value={this.state.gender ? this.state.gender : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="dateOfBirth"
              type="date"
              label="Date of Birth"
              value={this.state.dateOfBirth ? this.state.dateOfBirth : ''}
            />
          </FormGroup> 
          <FormGroup controlId="school-info">
            <this.FieldGroup
              id="current-school"
              type="text"
              label="Current school"
              placeholder="Enter student's current school"
              value={this.state.school.length ? this.state.school.find(s => s.currentSchool).schoolName : ''}
              onChange={this.handleSchoolChange}
            />
            <this.FieldGroup
              id="is-elementary"
              type="checkbox"
              label="Elementary school (check if it is)"
              checked={this.state.school.length ? this.state.school.find(s => s.currentSchool).isElementarySchool : false }
              onChange={this.handleIsElementarySchool}
            />
            <this.FieldGroup
              id="grade"
              type="text"
              label="Grade"
              placeholder="Enter student's grade in school"
              value={this.state.grade ? this.state.grade : ''}
              onChange={this.handleTextFieldChange}
            />         
          </FormGroup>
          <h4>Guardians</h4>
          {this.state.family.length 
            ? this.state.family.map((f, i) => (
              <FormGroup controlId={`guardians-${i}`} key={f.member._id} onChange={this.handleGuardianChange}>
                {`${f.member.firstName} ${f.member.lastName}:`}
                <Checkbox 
                  inline 
                  checked={f.weekdayGuardian}
                  id={f.member._id.toString()}
                  prop="weekdayGuardian"
                  >Weekday guardian</Checkbox> 
                <Checkbox 
                  inline 
                  checked={f.weekendGuardian}
                  id={f.member._id.toString()}
                  prop="weekendGuardian"
                  >Weekend guardian</Checkbox>
              </FormGroup>
            )) 
            : null 
          }
          <FormGroup controlId="urls">
            <this.FieldGroup
              id="synopsisReportArchiveUrl"
              key="synopsisReportArchiveUrl"
              type="text"
              label="Synopsis Reports Archive URL"
              placeholder="Enter student's synopsis report archive url"
              value={this.state.synopsisReportArchiveUrl ? this.state.synopsisReportArchiveUrl : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="googleCalendarUrl"
              key="googleCalendarUrl"
              type="text"
              label="Google Calendar URL"
              placeholder="Enter student's google calendar url"
              value={this.state.googleCalendarUrl ? this.state.googleCalendarUrl : ''}
              onChange={this.handleTextFieldChange}
            />
            <this.FieldGroup
              id="googleDocsUrl"
              key="googleDocsUrl"
              type="text"
              label="Google Docs URL"
              placeholder="Enter student's google documents url"
              value={this.state.googleDocsUrl ? this.state.googleDocsUrl : ''}
              onChange={this.handleTextFieldChange}
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
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
};

export default connect(mapStateToProps)(StudentDataForm);
