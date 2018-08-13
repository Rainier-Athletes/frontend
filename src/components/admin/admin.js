import React from 'react';
import PropTypes from 'prop-types';//eslint-disable-line
import validator from 'validator';
import { renderIf } from '../../lib/utils';
import * as routes from '../../lib/routes';//eslint-disable-line
import './_admin.scss';

const emptyState = {
  firstName: '',
  firstNameDirty: false,
  firstNameError: 'First name is required',

  lastName: '',
  lastNameDirty: false,
  lastNameError: 'Last name is required',

  email: '',
  emailDirty: false,
  emailError: 'Email is required',

  role: '',
  roleDirty: false,
  roleError: 'Role is required',

  conflictError: false,
  conflictErrorMsg: 'Mentor name or email already exists in the database',
};

const MIN_NAME_LENGTH = 1;
const ROLE = ['admin', 'staff', 'student', 'mentor', 'teacher', 'coach', 'family'];


export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
  }

  handleValidation = (name, value) => {
    if (this.props.type === 'add') {
      return null;
    }

    // name can either be "firstName", "lastName", or "email"
    switch (name) {
      case 'firstName':
        if (value.length < MIN_NAME_LENGTH) {
          return `First Name field must contain at least ${MIN_NAME_LENGTH} character long.`;
        }
        return null;
      case 'lastName':
        if (value.length < MIN_NAME_LENGTH) {
          return `Last Name field must contain at least ${MIN_NAME_LENGTH} character long.`;
        }
        return null;
      case 'email':
        if (!validator.isEmail(value)) {
          return 'Please provide a valid email.';
        }
        return null;
      case 'role':
        if (value !== ROLE) {
          return 'Please enter a role.';
        }
        return null;
      default: 
        return null;
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ 
      [name]: value,
      [`${name}Dirty`]: true,
      [`${name}Error`]: this.handleValidation(name, value),
      conflictError: false,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { firstNameError, lastNameError, emailError } = this.state; 
    if (!this.props.type === 'login' || (!firstNameError && !lastNameError && !emailError)) {
      this.props.onComplete(this.state)
        .then(() => {
          this.setState(emptyState);
        })
        .catch((error) => {
          if (error.status === 409) {
            this.setState({ conflictError: true });
          }
        });
    }
  }

  // renderEmailInput = (type) => {
  //   if (type === 'signup') {
  //     return (
  //       <div>
  //         { renderIf(this.state.emailDirty, <h4 className="error">{ this.state.emailError }</h4>)}
  //         <input 
  //           name="email"
  //           placeholder="email"
  //           type="email"
  //           value={this.state.email}
  //           onChange={this.handleChange}
  //         />
  //       </div>
  //     );
  //   }
  //   return undefined;
  // }

  // renderForm() {
  // }

  render() {
    let { type } = this.props;
    type = type === 'add';
    return (
      <div className="container">
        <h1>Add A New Person</h1>
          <form className="add-new-person" onSubmit={ this.handleSubmit }>
          <div className="top-row">
              <div className="field-wrap">
              {
              renderIf(this.state.firstNameDirty, <h4 className="error">{ this.state.firstNameError }</h4>)
              }
              <input 
                name="firstname"
                required placeholder="First Name*"
                type="text"
                value={ this.state.firstName }
                onChange={ this.handleChange }
              />
              </div>
              <div className="field-wrap">
              {
                renderIf(this.state.lastNameDirty, <h4 className="error">{ this.state.lastNameError }</h4>)
              }
              <input 
                name="lastname"
                placeholder="Last Name*"
                type="text"
                value={ this.state.lastName }
                onChange={ this.handleChange }
              />
              </div>
              <div className="field-wrap">
              {
                renderIf(this.state.emailDirty, <h4 className="error">{ this.state.emailError }</h4>)
              }
              <input 
                name="email"
                placeholder="Email*"
                type="email"
                value={ this.state.email }
                onChange={ this.handleChange }
              />
              </div>
              <div className="field-wrap">
              {
                renderIf(this.state.roleDirty, <h4 className="error">{ this.state.roleError }</h4>)
              }
              <input 
                name="role"
                placeholder="Role*"
                type="text"
                value={ this.state.role }
                onChange={ this.handleChange }
              />
              </div>
              {
                renderIf(this.state.conflictError, <h4 className="error">{ this.state.conflictErrorMsg }</h4>)
              }

            <div className="btn-container"><button type="submit" className="enter">{type}</button></div>
          </div>
        </form>
      </div>
    );
  }
}
 
Admin.propTypes = {
  type: PropTypes.func,
  onComplete: PropTypes.func,
};
