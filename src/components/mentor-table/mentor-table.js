/*eslint-disable*/
import React from 'react';
import ReactDataGrid from 'react-data-grid';
// import 'bootstrap/dist/css/bootstrap.css';
import update from 'immutability-helper';
import classNames from 'classnames';
import { render } from 'react-dom';
import { makeData, Tips } from '../../lib/utils';
import './mentor-table.scss';

const faker = require('faker');
const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { ImageFormatter } = Formatters;

export default class MentorTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'avatar',
        name: 'Avatar',
        width: 60,
        formatter: ImageFormatter,
        resizable: true,
        headerRenderer: <ImageFormatter value={faker.image.cats()} />
      },
      {
        key: 'firstName',
        name: 'First Name',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: 'lastName',
        name: 'Last Name',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: 'email',
        name: 'Email',
        editable: true,
        width: 200,
        resizable: true,
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
        key: 'city',
        name: 'City',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: 'zipCode',
        name: 'ZipCode',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: 'phoneNumber',
        name: 'Phone Number',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
    ];
    let originalRows = this.createRows(10);
    let rows = originalRows.slice(0);
    this.state = { originalRows, rows, selectedIndexes: [] };

    this.deleteBtn = <button className="deleteBtn">Delete</button>;
    this.updateBtn = <button className="updateBtn">Update</button>;
  }

  createRows = (numberOfRows) => {
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows[i] = this.createFakeRowObjectData(i);
    }
    return rows;
  };
  

  createFakeRowObjectData = (index) => {
    return {
      id: 'id_' + index,
      avatar: faker.image.avatar(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      address: faker.address.streetName(),
      city: 'Seattle',
      zipCode: faker.address.zipCode(),
      phoneNumber: faker.phone.phoneNumber(),
    };
  };

  getColumns = () => {
    let clonedColumns = this._columns.slice();
    clonedColumns[2].events = {
      onClick: (ev, args) => {
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

  handleDelete = (id, event) => {
    event.preventDefault();
    this.props.onDelete(this.props.profiles[i].id);
  }
  
  render() {
    return (
      <ReactDataGrid
        ref={ node => this.grid = node }
        enableCellSelect={true}
        onGridSort={this.handleGridSort}
        columns={this.getColumns()}
        rowGetter={this.getRowAt}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        toolbar={<div><Toolbar onAddRow={this.handleAddRow}/><div className="btnGroup">{this.deleteBtn}{this.updateBtn}</div></div>}
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
        rowScrollTimeout={200} />);
  }
}
