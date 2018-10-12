import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as extractActions from '../../actions/extract';

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
  csvLink: state.csvExtractLink,
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
    if (this.props.csvLink !== prevProps.csvLink) {
      this.setState({
        ...this.state,
        csvFileSaved: true,
        waitingOnSave: false,
        csvLink: this.props.csvLink,
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
        extractCommand = `${this.state.exportSource}?from=${this.state.exportFrom}&to=${this.state.exportTo}`;
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
      responseJSX = <h5>CSV Extract File URL: <a href={this.state.csvLink}>{this.state.csvLink}</a></h5>;
    } else if (this.state.error.status === 404) {
      responseJSX = <h5>No data found in the date range provided. Try a different range or try the request again if you are sure there is data available.</h5>;
    } else {
      responseJSX = <h5>Unexpected error saving CSV. Status: {this.error.status}, Message: {this.error.message}</h5>;
    }
    return responseJSX;
  };

  render() {
    return (
      <form onChange={this.exportFormChange}>
        <div className="fieldwrap dropdown">
          <label className="title" htmlFor="data-source">Exported data source:</label>
          <select type="text" id="data-source"required>
            <option value="" selected="true" disabled>-- select data source -- </option> 
            <option value="pointstracker" key="pointstracker">Point Tracker Forms</option>
            <option value="studentdata" key="studentdata">Student Data</option>
          </select>
        </div>
        <div className="fieldwrap">
          <label className="title" htmlFor="from">Starting date:</label>
          <input type="date" id="from" />
        </div>
        <div className="fieldwrap">
          <label className="title" htmlFor="to">Ending date:</label>
          <input type="date" id="to" />
        </div>
        { this.state.waitingOnSave 
          ? <h5>Waiting...</h5> 
          : <button 
            className="btn btn-secondary" 
            type="submit" 
            id="extract"
            onClick={this.handleExtractButton}>
            Create CSV Extract
            </button> }
        { this.state.csvFileSaved 
          ? this.csvFileSavedResponseJSX()
          : null }
      </form>
    );
  }
}

AdminExtract.propTypes = {
  csvLink: PropTypes.string,
  createCsvExtract: PropTypes.func,
  error: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminExtract);
