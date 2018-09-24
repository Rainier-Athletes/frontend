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
  const familyMembers = state.profile.filter(p => p.role === 'family');

  return ({ 
    student, 
    mentors, 
    coaches, 
    teachers, 
    familyMembers,
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

  IsActiveCheckboxJsx = () => {
    const { active } = this.props.student;
    return (
      <div>
        {active ? <Checkbox checked>Active</Checkbox> : <Checkbox>Active</Checkbox>}
      </div>
    );
  }

  handleChange = (e) => {
    console.log(e.target);
    console.log(e.target.checked);
    this.setState({ ...this.state, [e.target.id]: !e.target.checked });
  }

  handleMentorSelect = (e) => {
    const newState = { ...this.state };
    // clear all currentMentor flags
    newState.mentors.forEach((m) => { m.currentMentor = false; return undefined; });
    // add new mentor to mentors array if not already present and make it currentMentor
    if (!newState.mentors.map(m => m.mentor._id.toString()).includes(e.target.value.toString())) {
      newState.mentors.push({ mentor: this.props.mentors.find(m => m._id === e.target.value.toString()), currentMentor: true });
    } else {
      // make selected mentor c(urrent
      newState.mentors.forEach((m) => { 
        m.currentMentor = m.mentor._id.toString() === e.target.value.toString();
        return undefined;
      });
    }
    this.setState(newState);
    // @TODO: need to manage connections between student and mentor (and coach, etc)
    // can this be done in post save studentData hook on backend?
  }

  handleCoachesSelect = (e) => {
    console.log('handleCoachesSelect', e.target.options);
    for (let i = 0; i < e.target.options.length; i++) {
      if (e.target.options[i].selected) console.log(e.target.options[i].value);
    }
    debugger;
    const newState = { ...this.state };
    // clear all currentCoach flags
    newState.coaches.forEach((m) => { m.currentCoach = false; return undefined; });
    // add new mentor to mentors array if not already present and make it currentMentor
    if (!newState.coaches.map(m => m.coach._id.toString()).includes(e.target.value.toString())) {
      newState.mentors.push({ mentor: this.props.mentors.find(m => m._id === e.target.value.toString()), currentMentor: true });
    } else {
      // make selected mentor c(urrent
      newState.mentors.forEach((m) => { 
        m.currentMentor = m.mentor._id.toString() === e.target.value.toString();
        return undefined;
      });
    }
    this.setState(newState);
    // @TODO: need to manage connections between student and mentor (and coach, etc)
    // can this be done in post save studentData hook on backend?
  }

  render() {
    if (!this.state) return null;

    const FieldGroup = ({
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

    const currentMentor = this.state.mentors.length ? this.state.mentors.find(m => m.currentMentor).mentor : null;
    const currentMentorId = currentMentor ? currentMentor._id : '';
    const currentMentorName = currentMentorId
      ? `${currentMentor.firstName} ${currentMentor.lastName}` : 'Select a mentor';

    const currentCoaches = this.state.coaches.length
      ? this.state.coaches.filter(c => c.currentCoach) : null;
    const currentCoachIds = currentCoaches 
      ? currentCoaches.map(c => c.coach._id.toString()) : null;
    const currentCoachNames = currentCoaches 
      ? currentCoaches.map(c => `${c.coach.firstName} ${c.coach.lastName}`) : null;
    console.log(currentCoaches, currentCoachIds, currentCoachNames);

    return (
      <div className="student-data-form">
        <h1>Student Profile Data for {this.state.student.firstName} {this.state.student.lastName}</h1>
        <form>
          <FormGroup controlId="gender-dob">
            <FieldGroup
              id="gender"
              type="text"
              label="Gender"
              placeholder="Enter student's gender"
              value={this.state.gender ? this.state.gender : ''}
            />
            <FieldGroup
              id="dob"
              type="date"
              label="Date of Birth"
              value={this.state.dateOfBirth ? this.state.dateOfBirth : ''}
            />
          </FormGroup> 
          <FormGroup controlId="school-info">
            <FieldGroup
              id="current-school"
              type="text"
              label="Current school"
              placeholder="Enter student's current school"
              value={this.state.school.length ? this.state.school.find(s => s.currentSchool).schoolName : ''}
            />
            <FieldGroup
              id="is-elementary"
              type="checkbox"
              label="Elementary school (check if it is)"
              checked={this.state.school.length ? this.state.school.find(s => s.currentSchool).isElementarySchool : false }
            />
            <FieldGroup
              id="grade"
              type="text"
              label="Grade"
              placeholder="Enter student's grade in school"
              value={this.state.grade ? this.state.grade : ''}
            />         
          </FormGroup>
          <FormGroup controlId="select-mentor">         
            <ControlLabel>Select Mentor</ControlLabel>
            <FormControl 
              componentClass="select" 
              placeholder="Select mentor"
              onChange={this.handleMentorSelect}>
              <option
                value={currentMentorId} key={currentMentorId}>
                {currentMentorName}
              </option>
              {this.props.mentors.filter(m => m._id !== currentMentorId).map(m => (
                <option value={m._id} key={m._id}>{m.firstName} {m.lastName}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="select-coaches">         
            <ControlLabel>Select Coaches</ControlLabel>
            <FormControl 
              componentClass="select"
              multiple
              placeholder="Select coaches"
              onChange={this.handleCoachesSelect}>
              {currentCoaches.map((c, i) => (
              <option
                value={currentCoachIds[i]} key={currentCoachIds[i]}>
                {currentCoachNames[i]}
              </option>
              ))}
              {this.props.coaches.filter(c => !currentCoachIds.includes(c._id.toString())).map(c => (
                <option value={c._id} key={c._id}>{c.firstName} {c.lastName}</option>
              ))}
            </FormControl>
          </FormGroup>
          
          <FieldGroup
            id="formControlsEmail"
            type="email"
            label="Email address"
            placeholder="Enter email"
            />
          <FieldGroup id="formControlsPassword" label="Password" type="password" />
          <FieldGroup
            id="active"
            type="checkbox"
            label="Active"
            key="active"
            help="Check if student is an active RA participant."
            checked={this.props.student.active}
            onChange={this.handleChange}
          />
          <FieldGroup
            id="formControlsFile"
            type="file"
            label="File"
            help="Example block-level help text here."
          />

          <Checkbox checked readOnly>
            Checkbox
          </Checkbox>
          <Radio checked readOnly>
            Radio
          </Radio>

          <FormGroup>
            <Checkbox inline>1</Checkbox> <Checkbox inline>2</Checkbox>{' '}
            <Checkbox inline>3</Checkbox>
          </FormGroup>
          
          <FormGroup>
            <Radio name="radioGroup" inline>
              1
            </Radio>{' '}
            <Radio name="radioGroup" inline>
              2
            </Radio>{' '}
            <Radio name="radioGroup" inline>
              3
            </Radio>
          </FormGroup>

          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Select</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              <option value="select">select</option>
              <option value="other">...</option>
            </FormControl>
          </FormGroup>

          <FormGroup controlId="formControlsSelectMultiple">
            <ControlLabel>Multiple select</ControlLabel>
            <FormControl componentClass="select" multiple>
              <option value="select">select (multiple)</option>
              <option value="other">...</option>
            </FormControl>
          </FormGroup>

          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Textarea</ControlLabel>
            <FormControl componentClass="textarea" placeholder="textarea" />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Static text</ControlLabel>
            <FormControl.Static>email@example.com</FormControl.Static>
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
  familyMembers: PropTypes.array,
};

export default connect(mapStateToProps)(StudentDataForm);
