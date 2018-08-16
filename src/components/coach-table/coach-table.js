/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
// import 'bootstrap/dist/css/bootstrap.css';
import update from 'immutability-helper';
import { render } from 'react-dom';
import { makeData, Tips } from '../../lib/utils';

import './coach-table.scss';
import { DeleteAndSave } from '../buttons/buttons';

import * as profileActions from '../../actions/profile';

const faker = require('faker');
const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { ImageFormatter } = Formatters;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
  updateProfile: profile => dispatch(profileActions.updateProfileReq(profile)),
  createProfile: profile => dispatch(profileActions.createProfileReq(profile)),
});

class CoachTable extends React.Component {
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
        key: 'role',
        name: 'Role',
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
        key: 'phone',
        name: 'Phone',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
      },
    ];

    this.state = {
      rows: [],
      selectedIndexes: [],
      originalRows: [],
      expanded: {},
    };
  }

  componentWillMount = () => {
    this.createRows();
  }

  createRows = () => {
    this.props.fetchProfile()
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.payload.length ; i++) {
          rows[i] = this.populateData(res.payload[i], i);
        }
        return rows;
      })
      .then((rows) => {
        this.setState({ rows: rows });
        this.setState({ originalRows: rows });
      })
  };

  populateData = (profile, i) => {
    return {
      id: 'id_' + i,
      avatar: profile.picture,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: profile.role,
      phone: profile.phone,
      address: '',
      children: [
        { id: 'id_' + i + 2,
        avatar: faker.image.avatar(),
        firstName: profile.firstName,
        lastName: profile.lastName,
        // email: profile.email,
        role: profile.role,
        // phone: profile.phone,
        // address: '', 
      },
      ]
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

  getSubRowDetails = (rowItem) => {
    let isExpanded = this.state.expanded[rowItem.name] ? this.state.expanded[rowItem.name] : false;
    return {
      group: rowItem.children && rowItem.children.length > 0,
      expanded: isExpanded,
      children: rowItem.children,
      field: 'role',
      treeDepth: rowItem.treeDepth || 0,
      siblingIndex: rowItem.siblingIndex,
      numberSiblings: rowItem.numberSiblings
    };
  };

  onCellExpand = (args) => {
    let rows = this.state.rows.slice(0);
    let rowKey = args.rowData.name;
    let rowIndex = rows.indexOf(args.rowData);
    let subRows = args.expandArgs.children;

    let expanded = Object.assign({}, this.state.expanded);
    if (expanded && !expanded[rowKey]) {
      expanded[rowKey] = true;
      this.updateSubRowDetails(subRows, args.rowData.treeDepth);
      rows.splice(rowIndex + 1, 0, ...subRows);
    } else if (expanded[rowKey]) {
      expanded[rowKey] = false;
      rows.splice(rowIndex + 1, subRows.length);
    }

    this.setState({ expanded: expanded, rows: rows });
  };

  updateSubRowDetails = (subRows, parentTreeDepth) => {
    let treeDepth = parentTreeDepth || 0;
    subRows.forEach((sr, i) => {
      sr.treeDepth = treeDepth + 1;
      sr.siblingIndex = i;
      sr.numberSiblings = subRows.length;
    });
  };

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
        toolbar={<div><Toolbar onAddRow={this.handleAddRow}/><DeleteAndSave/></div>}
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
        getSubRowDetails={this.getSubRowDetails}
        onCellExpand={this.onCellExpand}
        rowHeight={50}
        minHeight={600}
        rowScrollTimeout={200} />);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoachTable);