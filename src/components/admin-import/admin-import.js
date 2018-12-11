import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import * as extractActions from '../../actions/extract';

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
  createCsvExtract: extractCommand => dispatch(extractActions.createCsvExtract(extractCommand)),
  // clearCsvExtractLink: () => dispatch(exportActions.clearCsvExtractLink()),
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
    console.log('importFormChange');
    console.log(e.target);
    console.log(e.target.files);
    let keyName;
    let value;
    switch (e.target.id) {
      case 'data-source':
        keyName = 'importSource';
        value = e.target.files[0].name;
        break;
      case 'data-type':
        keyName = 'importType';
        value = e.target.value;
        break;
      default:
    }
    return this.setState({ [keyName]: value, csvFileRead: false });
  }

  handleImportButton = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('handleImportButton e.target.id', e.target.id);
    let importCommand;
    switch (e.target.id) {
      case 'import':
        if (this.state.importType === 'profiles') {
          importCommand = `import ${this.state.importSource} as ${this.state.importType}`;
        } else if (this.state.importType === 'connections') {
          importCommand = `import ${this.state.importSource} as ${this.state.importType}`;
        }
        this.setState({ ...this.state, waitingOnSave: true });
        console.log(importCommand);
        console.log(e);
        // this.props.createCsvExtract(extractCommand);
        break;
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
    console.log('admin-import props.show', this.props.show);
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
