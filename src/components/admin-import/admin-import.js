import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import * as profileActions from '../../actions/profile';
import { csvUpload } from '../../lib/utils';

import './admin-import.scss';

const defaultImport = {
  importSource: '',
  importType: '',
  waitingOnSave: false,
  csvFileRead: false,
  error: null,
};

const mapStateToProps = state => ({
  csvResult: state.csvImport,
  error: state.error,
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(profileActions.updateProfileReq(profile)),
  createProfile: profile => dispatch(profileActions.createProfileReq(profile)),
});

class AdminImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultImport;
  }

  componentDidMount = () => {
    this.setState({ csvFileRead: false, waitingOnSave: false });
  }

  componentDidUpdate(prevProps) {
    if (this.props.csvResult !== prevProps.csvResult) {
      this.setState({
        ...this.state,
        csvFileRead: true,
        waitingOnSave: false,
        error: null,
      });
    }
    if (this.props.error !== prevProps.error) {
      this.setState({
        ...this.state,
        csvFileRead: true,
        waitingOnSave: false,
        error: this.props.error,
      });
    }
  }

  importFormChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let keyName;
    let value;
    switch (e.target.id) {
      case 'data-source':
        keyName = 'importSource';
        value = e.target.files[0]; // eslint-disable-line
        break;
      case 'data-type':
        keyName = 'importType';
        value = e.target.value; // eslint-disable-line
        break;
      default:
    }
    return this.setState({ [keyName]: value, csvFileRead: false });
  }

  _uploadProfileData = ({ profiles, studentData }) => {
    console.log('_uploadProfileData');
    console.log(profiles);
    console.log(studentData);
  }

  _uploadConnections = (connections) => {
    console.log('_uploadConnections');
    console.log(connections);
  }

  _importProfiles = (data) => {
    // firstName lastName	primaryEmail	role	street	apt	city	state	zip	cellPhone	phone	gender	dateOfBirth	schoolName	isElementarySchool	grade
    const profiles = [];
    const studentData = [];
    data.forEach((person) => {
      const profile = {};
      profile.firstName = person.firstName;
      profile.lastName = person.lastName;
      profile.primaryEmail = person.primaryEmail;
      profile.role = person.role.toLowerCase();
      profile.street = person.street;
      profile.apt = person.apt;
      profile.city = person.city;
      profile.state = person.state;
      profile.zip = person.zip;
      profile.cellPhone = person.cellPhone;
      profile.phone = person.phone;

      const studentInfo = {};
      studentInfo.gender = person.gender;
      studentInfo.dateOfBirth = person.dateOfBirth;
      studentInfo.school = {
        schoolName: person.schoolName,
        isElementarySchool: person.isElementarySchool.toUpperCase() === 'TRUE',
        currentSchool: true,
      };
      studentInfo.grade = person.grade;
      studentInfo.primaryEmail = person.primaryEmail; // not a prop of studentData but want to keep it for ID purposes

      profiles.push(profile);
      if (profile.role === 'student') {
        studentData.push(studentInfo);
      }
    });
    return { profiles, studentData };
  };

  _importConnections = (data) => {
    const connections = [];
    data.forEach((conn) => {
      const c = {};
      c.adultPrimaryEmail = conn.adultPrimaryEmail;
      c.role = conn.adultRole.toLowerCase();
      c.studentPrimaryEmail = conn.studentPrimaryEmail;
      connections.push(c);
    });
    // console.log('imported connections', connections);
    return connections;
  }

  _csvUpload = (fileType, fileUpload) => { 
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

    if (regex.test(fileUpload.name.toLowerCase())) { 
      if (typeof (FileReader) !== 'undefined') { 
        const reader = new FileReader();
    
        reader.onload = (e) => { 
          const rows = e.target.result.split('\n');
          const headerLabels = rows[0].split(',');
          const data = [];

          for (let i = 1; i < rows.length; i++) {                
            const cells = rows[i].split(','); 
            const rowObj = {};        
            for (let j = 0; j < cells.length; j++) {          
              rowObj[headerLabels[j].trim()] = cells[j];
            }
            data.push(rowObj);
          }
          // console.log('raw data', data);
          if (fileType === 'profiles') return this._uploadProfileData(this._importProfiles(data));
          if (fileType === 'connections') return this._uploadConnections(this._importConnections(data));

          return undefined;
        };  
        reader.readAsText(fileUpload);
      } else {
        alert('This browser does not support HTML5.');
      }
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  handleImportButton = (e) => {
    e.stopPropagation();
    e.preventDefault();

    switch (e.target.id) {
      case 'import':
        this.setState({ ...this.state, waitingOnSave: true });
        return this._csvUpload(this.state.importType, this.state.importSource);
      case 'cancel':
        this.setState({
          ...this.state,
          show: 'nada',
          ...defaultImport,
        });
        break;
      default:
    }
    return undefined;
  }

  csvFileSavedResponseJSX = () => {
    let responseJSX;
    if (!this.state.error) {
      responseJSX = this.state.csvLink
        ? <a className="btn btn-secondary" href={this.state.csvLink} role="button" target="blank" rel="noopener noreferrer">Link to CSV File</a>
        : <div>
            <h5>Coaches Mailmerge Data</h5>
            <div dangerouslySetInnerHTML={{ __html: this.state.coachesReport }} />
            <h5><br />Select the text above then copy and paste into a Google Sheets spreadsheet.</h5>
          </div>;
    } else if (this.state.error.status === 404) {
      responseJSX = <h6>No data found in the date range provided. Try a different range or try the request again if you are sure there is data available.</h6>;
    } else {
      responseJSX = <h6>Unexpected error saving CSV. Status: {this.error.status}, Message: {this.error.message}</h6>;
    }
    return responseJSX;
  };

  render() {
    if (!this.props.show) {
      return null;
    }

    const importButton = (
      this.state.waitingOnSave
        ? <FontAwesomeIcon icon="spinner" className="fa-spin fa-2x"/>
        : <button
          className="btn btn-secondary"
          type="submit"
          id="import"
          onClick={this.handleImportButton}>
          Import CSV File
          </button>
    );

    return (
      <div className="modal-backdrop">
        <div className="panel import-modal">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title title">Import CSV Data</h5>
                <button type="button" className="close" onClick={ this.props.onClose } data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <form onChange={this.importFormChange}>
                  <div className="fieldwrap dropdown">
                    <label className="title" htmlFor="data-type">Import data type:</label>
                    <select type="text" id="data-type"required>
                      <option value="" selected="true" disabled>-- select data type -- </option>
                      <option value="profiles" key="profiles">Profiles</option>
                      <option value="connections" key="connections">Connections</option>
                    </select>
                  </div>
                  <div className="fieldwrap">
                    <label className="title" htmlFor="data-source">CSV File:</label>
                    <input type="file" id="data-source" />
                  </div>
                  <div className="modal-footer">
                    { this.state.csvFileRead && !this.state.waitingOnSave
                      ? this.csvFileReadResponseJSX()
                      : importButton }
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

AdminImport.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  error: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminImport);
