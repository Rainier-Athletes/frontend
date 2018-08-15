/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
// import 'bootstrap/dist/css/bootstrap.css';
import update from 'immutability-helper';
import './mentor-table.scss';

import * as profileActions from '../../actions/profile';

const faker = require('faker');
const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');
// const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
// const { ImageFormatter } = Formatters;

const mapStateToProps = state => ({
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
  updateProfile: profile => dispatch(profileActions.updateProfileReq(profile)),
  createProfile: profile => dispatch(profileActions.createProfileReq(profile)),
});

class MentorTable extends React.Component {
  constructor(props) {
    super(props);

    this._columns = [
      {
        key: 'button',
        name: '',
        // formatter: SaveButton,
        width: 100,
        resizable: true,
        headerRenderer: ''
      },
      {
        key: 'firstName',
        name: 'First Name',
        editable: true,
        width: 200,
        resizable: false,
        sortable: true,
      },
      {
        key: 'lastName',
        name: 'Last Name',
        editable: true,
        width: 200,
        resizable: false,
        sortable: true,
      },
      {
        key: 'email',
        name: 'Email',
        editable: true,
        width: 200,
        resizable: false,
        sortable: true,
      },
      // how do we use the role field as a key to drop data into the correct object?
      {
        key: 'role',
        name: 'Role',
        editable: true,
        width: 200,
        resizable: false,
        sortable: true,
      },
      {
        key: 'address',
        name: 'Address',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: 'phone',
        name: 'Phone',
        editable: true,
        width: 200,
        resizable: false,
        sortable: true,
      },
    ];
    this.state = {
      rows: [],
    };
  }
  componentWillMount = () => {
    this.createRows();
  }

  createRows = () => {
    this.props.fetchProfile()
      .then((res) => {
        console.log(res);
        let rows = [];
        for (let i = 0; i < res.payload.length ; i++) {
          rows[i] = this.populateData(res.payload[i], i);
        }
        return rows;
      })
      .then((rows) => {
        console.log(rows);
        this.setState({ rows: rows});
      })
  };
  
  createSaveBtn = (index) => {
    return {
      id: 'id_' + index,
      button: <button>Oopsie</button>,
    };
  };

  populateData = (profile, index) => {
    console.log('populate data', profile);
    return {
      id: 'id_' + index,
      firstName: String,
      lastName: String,
      email: String,
      address: String,
      city: String,
      zipCode: Number,
      phoneNumber: String,
    };
  };

  getColumns = () => {
    let clonedColumns = this._columns.slice();
    clonedColumns[2].events = {
      onClick: (events, args) => {
        const idx = args.idx;
        const rowIdx = args.rowIdx;
        this.grid.openCellEditor(rowIdx, idx);
      }
    };
    return clonedColumns;
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
      value: newRowIndex,
      userStory: '',
      developer: '',
      epic: ''
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$unshift: [newRow]});
    this.setState({ rows });
  };

  onRowsSelected = (rows) => {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});

  };

  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
  };

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };
    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
    console.log(this.state)
    this.setState({ rows });
  };

  getRowAt = (index) => {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }

    return this.state.rows[index];
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };


  getSize = () => {
    return this.state.rows.length;
  };

  handleCreate = (profile) => {
    this.props.createProfile(profile)
      .then(() => {
        this.props.history.push(routes.PROFILE_ROUTE);
      });
  }

  handleUpdate = (profile) => {
    this.props.updateProfile(profile);
    this.setState({ editing: false });
  }

  handleDelete = (event) => {
    event.preventDefault();
    this.props.onDelete(this.props.profiles[i].id);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    return this.props.onComplete(this.state)
      .then(() => {
        this.setState({ rows });
      })
      .catch(console.error);
  }
  
  render() {
    const buttonText = this.props.profile ? 'Update' : 'Create';
    return (
      <div className="mentor-table" onSubmit={ this.handleSubmit }>

      <ReactDataGrid
        ref={ node => this.grid = node }
        enableCellSelect={true}
        onGridSort={this.handleGridSort}
        columns={this.getColumns()}
        rowGetter={this.getRowAt}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        onChange={ this.handleChange }
        toolbar=
        {
        <div>
          <Toolbar onAddRow={this.handleAddRow}/>
          <div className="btnGroup">{ buttonText }</div>
        </div>
        }
        enableRowSelect={true}
        onRowSelect={this.onRowSelect}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: this.onRowsSelected,
          onRowsDeselected: this.onRowsDeselected,
          selectBy: {
            indexes: this.state.selectedIndexes
          }
        }} 
        rowHeight={50}
        minHeight={600}
        rowScrollTimeout={200} />
      </div>
    );
  }
}


MentorTable.propTypes = {
  onComplete: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(MentorTable);
