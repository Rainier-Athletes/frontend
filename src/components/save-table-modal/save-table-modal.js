import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as routes from '../../lib/routes';//eslint-disable-line

import './save-table-modal.scss';

class SaveTableModal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal-backdrop">
        <div className="panel save-table-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title title">New and updated profiles</h5>
              <button type="button" className="close" onClick={ this.props.onClose } data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <label className="title">New profiles</label>
              {
                this.props.newRows.filter(p => p !== null).length > 0 ? <span className="red-circle">{this.props.newRows.filter(p => p !== null).length}</span> : null
              }
              <table className="table save-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Primary Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.newRows.filter(p => p !== null).map((p, i) => {
                      return <tr key={i}>
                          <td>{p.firstName}</td>
                          <td>{p.lastName}</td>
                          <td>{p.primaryEmail}</td>
                          <td>{p.role}</td>
                        </tr>;
                    })
                  }
                </tbody>
              </table>

              <label className="title">Updated Rows</label>
              {
                this.props.updatedRows.filter(p => p !== null).length > 0 ? <span className="red-circle">{this.props.updatedRows.filter(p => p !== null).length}</span> : null
              }
              <table className="table save-table">
                <thead>
                  <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Primary Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.updatedRows.filter(p => p !== null).map((p, i) => {
                      return <tr key={i}>
                          <td>{p.firstName}</td>
                          <td>{p.lastName}</td>
                          <td>{p.primaryEmail}</td>
                          <td>{p.role}</td>
                        </tr>;
                    })
                  }
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-secondary" onClick={this.props.onSubmit}>Update Table</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

SaveTableModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool,
  newRows: PropTypes.array,
  updatedRows: PropTypes.array,
};

export default connect(null, null)(SaveTableModal);
