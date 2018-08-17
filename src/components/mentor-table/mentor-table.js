/*eslint-disable*/
import React from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
// import 'bootstrap/dist/css/bootstrap.css';
import update from 'immutability-helper';
import { render } from 'react-dom';
import { makeData, Tips } from '../../lib/utils';
import './mentor-table.scss';

import * as profileActions from '../../actions/profile';

const faker = require('faker');
const { Editors, Formatters, Toolbar, Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter }, Data: { Selectors } } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { ImageFormatter } = Formatters;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
  updateProfile: profile => dispatch(profileActions.updateProfileReq(profile)),
  createProfile: profile => dispatch(profileActions.createProfileReq(profile)),
  deleteProfile: profile => dispatch(profileActions.deleteProfileReq(profile)),
});

const newRows = {};
const updatedRows = {};

class MentorTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'avatar',
        name: 'Avatar',
        width: 60,
        formatter: ImageFormatter,
        resizable: true,
        headerRenderer: <ImageFormatter value={faker.image.cats()} />,
      },
      {
        key: 'firstName',
        name: 'First Name',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'lastName',
        name: 'Last Name',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'email',
        name: 'Email',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'role',
        name: 'Role',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: MultiSelectFilter,
      },
      {
        key: 'address',
        name: 'Address',
        editable: true,
        width: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
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
      filters: {},
      counter: 0,
      newRows: [],
      updatedRows: [],
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

  populateMentorChildren = (profile) => {
    let childArr = [];
    for (const i in profile.students) {
      childArr.push(profile.students[i]);
    }
    return childArr;
  };

  populateStudentChildren = (profile) => {
    let childArr = [];
    if (profile.studentData.mentor) {
      childArr.push(profile.studentData.mentor);
    }
    for (const i in profile.studentData.coaches) {
      console.log('coaches', profile.studentData.coaches[i]);
      childArr.push(profile.studentData.coaches[i]);
    }
    for (const i in profile.studentData.family) {
      console.log('family', profile.studentData.family[i]);
      childArr.push(profile.studentData.family[i]);
    }
    for (const i in profile.studentData.teachers) {
      console.log('teachers', profile.studentData.teachers[i]);
      childArr.push(profile.studentData.teachers[i]);
    }
    return childArr;
  };

  populateData = (profile, i) => {
    let childArr;
    if (profile.role === 'mentor' && profile.students.length > 0) {
      childArr = this.populateMentorChildren(profile);
      console.log(childArr);
    }
    if (profile.role === 'student') {
      childArr = this.populateStudentChildren(profile);
      console.log(childArr);
    }

    return {
      _id: profile._id,
      avatar: profile.picture,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: profile.role,
      phone: profile.phone,
      address: '',
      children: childArr,
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
      console.log('UPDATED', rows[i]);

      if (!rows[i]._id) {
        const index = this.state.counter;
        newRows[index] = rows[i];
        this.setState({ newRows: newRows });
      } else {
        updatedRows[rows[i].id] = rows[i];
        this.setState({ updatedRows: updatedRows });
      }

    }
    this.setState({ rows });
    this.setState({ originalRows: rows })
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
    this.state.counter += 1;
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
    console.log(profile);
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
    const selected = this.state.selectedIndexes;
    for (const index in selected) {
      const i = selected[index];
      this.props.deleteProfile(this.state.rows[i]);
    }
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

  handleUpdateTable = () => {
    const { newRows, updatedRows } = this.state;
    Object.keys(newRows).forEach((key) => {
      console.log(newRows[key]);
      this.handleCreate(newRows[key]);
    });
    Object.keys(updatedRows).forEach((key) => {
      console.log(updatedRows[key]);
      this.handleUpdate(updatedRows[key]);
    });
  };

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    let values = this.state.rows.map(r => r[columnId]);
    return values.filter((item, i, a) => { return i === a.indexOf(item); });
    c
  };

  handleOnClearFilters = () => {
    this.setState({ filters: {} });
  };

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
    let rows = this.getRows();
    return rows[rowIdx];
  };

  render() {
    return (
      <ReactDataGrid
        ref={ node => this.grid = node }
        enableCellSelect={true}
        onGridSort={this.handleGridSort}
        columns={this.getColumns()}
        rowGetter={ this.rowGetter }
        rowsCount={this.getSize()}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        toolbar={
          <Toolbar onAddRow={ this.handleAddRow } enableFilter={ true }>
            <button className="updateBtn" onClick={ this.handleUpdateTable }>Save Table</button>
            <button className="deleteBtn" onClick={ this.handleDelete }>Delete Row</button>
          </Toolbar>
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
        getSubRowDetails={this.getSubRowDetails}
        onCellExpand={this.onCellExpand}
        rowHeight={50}
        minHeight={600}
        rowScrollTimeout={200}
        onAddFilter={this.handleFilterChange}
        getValidFilterValues={this.getValidFilterValues}
        onClearFilters={this.handleOnClearFilters}
        />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MentorTable);
