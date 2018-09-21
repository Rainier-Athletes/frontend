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

const mapStateToProps = (state, ownProps) => {
  if (!state.profile) return {};
  const student = state.students.filter(s => s._id.toString() === ownProps.studentId.toString())[0];
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
  // student: state.students.filter(s => s._id === ownProps.studentId)[0],
};

class StudentDataForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = props.student ? props.student.studentData : null;
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

    return (
    <form>
      <FieldGroup
        id="formControlsText"
        type="text"
        label="Text"
        placeholder="Enter text"
        />
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
    );
  }
}

StudentDataForm.propTypes = {
  student: PropTypes.object,
};

export default connect(mapStateToProps)(StudentDataForm);
