import React from 'react';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import ConnectionModal from '../connection-modal/connection-modal';
import './admin-table.scss';
import StudentDataModal from '../student-data-form/student-data-form';
import SaveTableModal from '../save-table-modal/save-table-modal';

import * as profileActions from '../../actions/profile';
import * as relationshipActions from '../../actions/relationship';
import raLogo from '../../assets/rainier-logo-100px.png';

const { Editors, Formatters, Toolbar, Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter }, Data: { Selectors } } = require('react-data-grid-addons'); // eslint-disable-line
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors; // eslint-disable-line
const { ImageFormatter } = Formatters;

const mapDispatchToProps = dispatch => ({
  fetchProfile: profile => dispatch(profileActions.fetchProfileReq(profile)),
  updateProfile: profile => dispatch(profileActions.updateProfileReq(profile)),
  createProfile: profile => dispatch(profileActions.createProfileReq(profile)),
  deleteProfile: profile => dispatch(profileActions.deleteProfileReq(profile)),
  deleteRelationship: profiles => dispatch(relationshipActions.deleteRelationshipReq(profiles)),
});

class AdminTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'avatar',
        name: 'Avatar',
        width: 60,
        formatter: ImageFormatter,
        resizable: false,
        headerRenderer: <ImageFormatter value={raLogo} />,
      },
      {
        key: 'firstName',
        name: 'First Name',
        editable: true,
        width: 75,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'lastName',
        name: 'Last Name',
        editable: true,
        width: 75,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'primaryEmail',
        name: 'Primary Email',
        editable: true,
        width: 125,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'secondaryEmail',
        name: 'Secondary Email',
        editable: true,
        width: 125,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'role',
        name: 'Role',
        editable: true,
        width: 95,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: MultiSelectFilter,
      },
      {
        key: 'street',
        name: 'Street',
        editable: true,
        width: 125,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'apt',
        name: 'Apt',
        editable: true,
        width: 40,
        resizable: false,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'city',
        name: 'City',
        editable: true,
        width: 75,
        resizable: true,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'state',
        name: 'State',
        editable: true,
        width: 40,
        resizable: false,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'zip',
        name: 'Zip',
        editable: true,
        width: 40,
        resizable: false,
        sortable: true,
        filterable: true,
        filterRenderer: AutoCompleteFilter,
      },
      {
        key: 'cellPhone',
        name: 'Cell #',
        editable: true,
        width: 100,
        resizable: true,
        sortable: true,
      },
      {
        key: 'phone',
        name: 'Alt #',
        editable: true,
        width: 100,
        resizable: true,
        sortable: true,
      },
    ];
    this.state = {
      rows: [],
      selectedIndexes: [],
      studentSelected: null,
      originalRows: [],
      expanded: {},
      filters: {},
      counter: 0,
      newRows: [],
      updatedRows: [],
      gridModified: false,
      isOpen: false, // for the modal
      sdIsOpen: false, // for student data form modal
      saveTableIsOpen: false, // for save table modal
    };
  }

  componentDidMount = () => {
    this.createRows();
  }

  willTransitionFrom(component, transition) {
    if (this.state.gridModified && !window.confirm('Unsaved changes! Are you sure you want to leave?')) {
      transition.abort();
    }
  }

  createRows = () => {
    return new Promise((resolve) => {
      this.props.fetchProfile()
        .then((res) => {
          const rows = [];
          for (let i = 0; i < res.payload.length; i++) {
            if (res.payload[i].active) rows.push(this.populateData(res.payload[i]));
          }
          return rows;
        })
        .then((rows) => {
          this.setState({ rows, originalRows: rows });
        })
        .then(() => {
          return resolve();
        });
    });
  };

  populateNonStudentChildren = (profile) => {
    const childArr = [];
    profile.students.forEach((student) => {
      if (student.active) childArr.push(student);
    });
    return childArr;
  };

  populateStudentChildren = (profile) => {
    const childArr = [];

    if (!profile.studentData) return childArr;

    profile.studentData.mentors.forEach((mentor) => {
      if (mentor.mentor.active && mentor.currentMentor) childArr.push(mentor.mentor);
    });

    profile.studentData.coaches.forEach((coach) => {
      if (coach.coach.active && coach.currentCoach) childArr.push(coach.coach);
    });

    profile.studentData.family.forEach((member) => {
      if (member.member.active) childArr.push(member.member);
    });

    profile.studentData.teachers.forEach((teacher) => {
      if (teacher.teacher.active && teacher.currentTeacher) childArr.push(teacher.teacher);
    });

    return childArr;
  };

  populateData = (profile) => {
    let childArr;
    if (profile.role !== 'student' && profile.students.length > 0) {
      childArr = this.populateNonStudentChildren(profile);
    }
    if (profile.role === 'student') {
      childArr = this.populateStudentChildren(profile);
    }

    return {
      _id: profile._id,
      avatar: profile.picture,
      firstName: profile.firstName,
      lastName: profile.lastName,
      primaryEmail: profile.primaryEmail,
      secondaryEmail: profile.secondaryEmail,
      role: profile.role,
      cellPhone: profile.cellPhone,
      phone: profile.phone,
      street: profile.street,
      apt: profile.apt,
      city: profile.city,
      state: profile.state,
      zip: profile.zip,
      children: childArr,
    };
  };

  getColumns = () => {
    const clonedColumns = this._columns.slice();
    clonedColumns[2].events = {
      onClick: (ev, args) => {
        const { idx, rowIdx } = args;
        this.grid.openCellEditor(rowIdx, idx);
      },
    };
    return clonedColumns;
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    console.log('handleGridRowsUpdate', fromRow, toRow, updated);
    const rows = this.state.rows.slice();
    const newRows = this.state.newRows.slice();
    const updatedRows = this.state.updatedRows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      const rowToUpdate = rows[i];
      const updatedRow = update(rowToUpdate, { $merge: updated });
      rows[i] = updatedRow;

      if (!rows[i]._id) { // if no _id prop it hasn't been retrieved/saved to db
        const index = this.state.counter;
        newRows[index] = rows[i];
        // this.setState({ newRows });
      } else {
        updatedRows.push(rows[i]);
        // this.setState({ updatedRows });
      }
    }
    this.setState({
      rows,
      newRows,
      updatedRows,
      gridModified: true,
      originalRows: rows,
    });
  }

  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
      value: newRowIndex,
      userStory: '',
      developer: '',
      epic: '',
    };

    let rows = this.state.rows.slice();
    rows = update(rows, { $unshift: [newRow] });
    const num = this.state.counter + 1;
    this.setState({ rows, counter: num, gridModified: true });
    // this.setState({ counter: num });
  };

  onRowsSelected = (rows) => {
    this.setState({
      selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)),
      studentSelected: rows[0].row.role === 'student' ? rows[0].row._id.toString() : null,
    });
  };

  onRowsDeselected = (rows) => {
    let rowIndexes;
    if (typeof rows[0] === 'object') {
      rowIndexes = rows.map(r => r.rowIdx);
    } else {
      rowIndexes = rows;
    }
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1),
      studentSelected: null,
    });
  };

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => { // eslint-disable-line
      if (sortDirection === 'ASC') {
        return (a[sortColumn].toUpperCase() > b[sortColumn].toUpperCase()) ? 1 : -1;
      }
      if (sortDirection === 'DESC') {
        return (a[sortColumn].toUpperCase() < b[sortColumn].toUpperCase()) ? 1 : -1;
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

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
  };

  handleCreate = (profile) => {
    this.props.createProfile(profile);
  }

  handleUpdate = (profile) => {
    this.props.updateProfile(profile);
    this.setState({ editing: false });
  }

  handleDelete = (event) => {
    event.preventDefault();
    const selected = this.state.selectedIndexes.sort((a, b) => b - a); // sort selection in inverse order
    const rows = this.state.rows.slice(0);

    // check for connections on rows selected for deactivation
    let activeConnections = false;
    for (let index = 0; index < selected.length; index++) {
      const i = selected[index];
      if (rows[i].children && rows[i].children.length) activeConnections = true;
      if (activeConnections) break;
    }
    if (activeConnections) {
      return alert('Please remove all active connections from selected rows before deleting.');
    }

    for (let index = 0; index < selected.length; index++) {
      const i = selected[index];
      if (rows[i]._id) this.props.deleteProfile(rows[i]);
    }

    // now delete rows from grid in sorted (inverse) order
    // so as to not mess up indexes and delete the wrong row(s)
    let { counter } = this.state; // handle special case of deleting rows just added
    let addedRows = this.state.newRows.slice(); // same here
    for (let index = 0; index < selected.length; index++) {
      const i = selected[index];
      if (!rows[i]._id) { // row was added but not yet saved to db
        addedRows = addedRows.filter(row => row.lastName !== rows[i].lastName && row.firstName !== rows[i].firstName); // firstName and lastName are the only values required by the db
        counter -= 1;
      }
      rows.splice(i, 1);
    }

    const gridModified = !(counter === 0 && this.state.updatedRows.length === 0);
    this.onRowsDeselected(selected); // clear selection boxes
    this.setState({
      rows,
      newRows: addedRows,
      counter,
      gridModified,
    });
  }

  getSubRowDetails = (rowItem) => {
    const isExpanded = this.state.expanded[rowItem.name] ? this.state.expanded[rowItem.name] : false;
    return {
      group: rowItem.children && rowItem.children.length > 0,
      expanded: isExpanded,
      children: rowItem.children,
      field: 'role',
      treeDepth: rowItem.treeDepth || 0,
      siblingIndex: rowItem.siblingIndex,
      numberSiblings: rowItem.numberSiblings,
    };
  };

  onCellExpand = (args) => {
    const rows = this.state.rows.slice(0);
    const rowKey = args.rowData.name;
    const rowIndex = rows.indexOf(args.rowData);
    const subRows = args.expandArgs.children;

    const expanded = Object.assign({}, this.state.expanded);
    if (expanded && !expanded[rowKey]) {
      expanded[rowKey] = true;
      this.updateSubRowDetails(subRows, args.rowData.treeDepth);
      rows.splice(rowIndex + 1, 0, ...subRows);
    } else if (expanded[rowKey]) {
      expanded[rowKey] = false;
      rows.splice(rowIndex + 1, subRows.length);
    }

    this.setState({ expanded, rows });
  };

  updateSubRowDetails = (subRows, parentTreeDepth) => {
    const treeDepth = parentTreeDepth || 0;
    subRows.forEach((sr, i) => {
      sr.treeDepth = treeDepth + 1;
      sr.siblingIndex = i;
      sr.numberSiblings = subRows.length;
    });
  };

  handleUpdateTable = () => {
    const { newRows, updatedRows } = this.state; // eslint-disable-line

    newRows.forEach(row => this.handleCreate(row));
    updatedRows.forEach(row => this.handleUpdate(row));
    this.setState({
      gridModified: false,
      updatedRows: [],
      newRows: [],
      counters: 0,
    });
    this.createRows() // refresh state with updated rows from db
      .then(() => {
        window.location.reload();
      });
  };

  handleFilterChange = (filter) => {
    const newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    const values = this.state.rows.map(r => r[columnId]);
    const returnValue = values.filter((item, i, a) => { return i === a.indexOf(item) && item !== undefined; });
    return returnValue[0] ? returnValue : [];
  };

  handleOnClearFilters = () => {
    this.setState({ filters: {} });
  };

  toggleModal = () => {
    if (this.state.gridModified) return alert('Please save changes to table before adding new connection.');
    return this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  toggleSaveTableModal = () => {
    return this.setState({
      saveTableIsOpen: !this.state.saveTableIsOpen,
    });
  }

  toggleSdModal = () => {
    if (!this.state.studentSelected) return undefined;

    return this.setState({
      sdIsOpen: !this.state.sdIsOpen,
    });
  }


  handleDetach = () => {
    const selected = this.state.selectedIndexes;
    const query = {};
    for (const index in selected) { // eslint-disable-line
      const i = selected[index];
      const r = this.state.rows[i];
      query[r.role] = r._id;
    }
    this.props.deleteRelationship(query);
  }

  /*eslint-disable*/
  render() {
    return (
      <React.Fragment>
        <ConnectionModal
          show={this.state.isOpen}
          onClose={this.toggleModal}>
        </ConnectionModal>
        <SaveTableModal
          show={this.state.saveTableIsOpen}
          newRows={this.state.newRows}
          updatedRows={this.state.updatedRows}
          onClose={this.toggleSaveTableModal}
          onSubmit={this.handleUpdateTable}>
        </SaveTableModal>
        {this.state.sdIsOpen
          ? <StudentDataModal onClose={this.toggleSdModal} studentId={this.state.studentSelected}></StudentDataModal> : null}
        <Prompt when={this.state.gridModified} message="Unsaved changes. Are you sure you want to leave?" />
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
              <button className={`updateBtn ${this.state.gridModified ? 'saveAlert' : ''}`} onClick={ this.toggleSaveTableModal }>Save Table</button>
              <button className="modalBtn" onClick={this.toggleModal}>+ Add A Connection</button>
              <button className="modalBtn" onClick={this.toggleSdModal}>Access Student Data*</button>
              <button className="deleteBtn" onClick={ this.handleDelete }>Delete Row</button>
              <button className="deleteConnectionBtn" onClick={ this.handleDetach }>Remove Connection</button>
              <p className="infoText">*To access a student's data, click the checkbox next to student name, then click the Access Student Data button.</p>
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
              indexes: this.state.selectedIndexes,
            },
          }}
          getSubRowDetails={this.getSubRowDetails}
          onCellExpand={this.onCellExpand}
          rowHeight={40}
          minHeight={600}
          rowScrollTimeout={200}
          onAddFilter={this.handleFilterChange}
          getValidFilterValues={this.getValidFilterValues}
          onClearFilters={this.handleOnClearFilters}
          />
      </React.Fragment>
    );
  }
}

AdminTable.propTypes = {
  fetchProfile: PropTypes.func,
  updateProfile: PropTypes.func,
  createProfile: PropTypes.func,
  deleteProfile: PropTypes.func,
  history: PropTypes.array,
  deleteRelationship: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(AdminTable);
