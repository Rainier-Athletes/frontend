import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import * as extractActions from '../../actions/extract';

import './admin-extract.scss';

const defaultExport = {
  exportSource: '',
  exportFrom: '',
  exportTo: '',
  waitingOnSave: false,
  csvFileSaved: false,
  error: null,
  csvLink: '',
};

const mapStateToProps = state => ({
  csvResult: state.csvExtract,
  error: state.error,
});

const mapDispatchToProps = dispatch => ({
  createCsvExtract: extractCommand => dispatch(extractActions.createCsvExtract(extractCommand)),
  // clearCsvExtractLink: () => dispatch(exportActions.clearCsvExtractLink()),
});

class AdminExtract extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultExport;
  }

  componentDidMount = () => {
    this.setState({ csvFileSaved: false, waitingOnSave: false });
  }

  componentDidUpdate(prevProps) {
    if (this.props.csvResult !== prevProps.csvResult) {
      this.setState({
        ...this.state,
        csvFileSaved: true,
        waitingOnSave: false,
        csvLink: this.props.csvResult.link || '',
        coachesReport: this.props.csvResult.coaches || {},
        error: null,
      });
    }
    if (this.props.error !== prevProps.error) {
      this.setState({
        ...this.state,
        csvFileSaved: true,
        waitingOnSave: false,
        csvLink: '',
        error: this.props.error,
      });
    }
  }

  exportFormChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let keyName;
    switch (e.target.id) {
      case 'data-source':
        keyName = 'exportSource';
        break;
      case 'from':
        keyName = 'exportFrom';
        break;
      case 'to':
        keyName = 'exportTo';
        break;
      default:
    }
    return this.setState({ [keyName]: e.target.value, csvFileSaved: false });
  }

  handleExtractButton = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let extractCommand;
    switch (e.target.id) {
      case 'extract':
        if (this.state.exportSource !== 'coachesreport') {
          extractCommand = `${this.state.exportSource}?from=${this.state.exportFrom}&to=${this.state.exportTo}`;
        } else {
          extractCommand = this.state.exportSource;
        }
        this.setState({ ...this.state, waitingOnSave: true });
        this.props.createCsvExtract(extractCommand);
        break;
      case 'cancel':
        this.setState({
          ...this.state,
          show: 'nada',
          ...defaultExport,
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

    const extractButton = (
      this.state.waitingOnSave
        ? <FontAwesomeIcon icon="spinner" className="fa-spin fa-2x"/>
        : <button
          className="btn btn-secondary"
          type="submit"
          id="extract"
          onClick={this.handleExtractButton}>
          Create CSV Extract
          </button>
    );

    return (
      <div className="modal-backdrop">
        <div className="panel extract-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title title">Export as CSV</h5>
                <button type="button" className="close" onClick={ this.props.onClose } data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <form onChange={this.exportFormChange}>
                  <div className="fieldwrap dropdown">
                    <label className="title" htmlFor="data-source">Exported data source:</label>
                    <select type="text" id="data-source"required>
                      <option value="" selected="true" disabled>-- select data source -- </option>
                      <option value="pointstracker" key="pointstracker">Synopsis Reports</option>
                      <option value="studentdata" key="studentdata">Student Data</option>
                      <option value="coachesreport" key="coachesreport">Coaches Mailmerge Report</option>
                    </select>
                  </div>
                  {this.state.exportSource !== 'coachesreport'
                    ? <div className="fieldwrap">
                        <label className="title" htmlFor="from">Starting date:</label>
                        <input type="date" id="from" />
                      </div>
                    : null}
                  {this.state.exportSource !== 'coachesreport'
                    ? <div className="fieldwrap">
                        <label className="title" htmlFor="to">Ending date:</label>
                        <input type="date" id="to" />
                      </div>
                    : null}
                    <div className="modal-footer">
                      { this.state.csvFileSaved && !this.state.waitingOnSave
                        ? this.csvFileSavedResponseJSX()
                        : extractButton }
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

AdminExtract.propTypes = {
  show: PropTypes.func,
  onClose: PropTypes.func,
  csvResult: PropTypes.object,
  createCsvExtract: PropTypes.func,
  error: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminExtract);
