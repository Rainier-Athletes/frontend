import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import './pt-comm-table.scss';

const CommTable = (props) => {
  // this.state = {
  //   communications: [
  //     {
  //       with: 'Student',
  //       role: 'student',
  //       f2fCheckIn: false,
  //       f2fRaEvent: false,
  //       f2fGameOrPractice: false,
  //       basecampOrEmail: false,
  //       phoneOrText: false,
  //       familyMeeting: false,
  //       notes: '',
  //     },
  //     {
  //       with: 'Family',
  //       role: 'family',
  //       f2fCheckIn: false,
  //       f2fRaEvent: false,
  //       f2fGameOrPractice: false,
  //       basecampOrEmail: false,
  //       phoneOrText: false,
  //       familyMeeting: false,
  //       notes: '',
  //     },
  //     {
  //       with: 'Teacher',
  //       role: 'teacher',
  //       f2fCheckIn: false,
  //       f2fRaEvent: false,
  //       f2fGameOrPractice: false,
  //       basecampOrEmail: false,
  //       phoneOrText: false,
  //       familyMeeting: false,
  //       notes: '',
  //     },
  //     {
  //       with: 'Coach',
  //       role: 'coach',
  //       f2fCheckIn: false,
  //       f2fRaEvent: false,
  //       f2fGameOrPractice: false,
  //       basecampOrEmail: false,
  //       phoneOrText: false,
  //       familyMeeting: false,
  //       notes: '',
  //     },
  //   ],
  // };
  // }

  // handleCommCheckboxChange = (event) => {
  //   const { name, checked } = event.target;
  //   const [role, row, columnKey] = name.split('-'); // eslint-disable-line

  //   this.setState((prevState) => {
  //     const newState = { ...prevState };
  //     newState.communications[row][columnKey] = checked;
  //     return newState;
  //   });
  // }

  const commCheckbox = (com, row, col) => {
    const columnKeys = [{
      dataField: 'faceToFace',
      text: 'Face-to-Face',
    }, {
      dataField: 'digital',
      text: 'Digital',
    }, {
      dataField: 'phone',
      text: 'Phone',
    }, {
      dataField: 'other',
      text: 'Other',
    }];
  
    const checked = props.communications[row][columnKeys[col]] || false;

    return (
    <input
      type="checkbox"
      name={ `${com.role}-${row}-${columnKeys[col]}` }
      onChange= { props.onCheckboxChange }
      checked={ checked }
      />
    );
  };

  // render() {
  return (
      <BootstrapTable data={props.communications} striped={true} hover={true}>
      <TableHeaderColumn 
            dataField='raCorePillar' 
            isKey={true} 
            dataAlign='center' 
            width='50px'
            dataSort={false}>RA Core Pillar
          </TableHeaderColumn>
        <TableHeaderColumn 
            dataField='faceToFace' 
            isKey={true} 
            dataAlign='center' 
            width='50px'
            dataSort={false}>Face-to-Face
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField='digital' 
            // isKey={true} 
            dataAlign='center' 
            width='50px'
            dataSort={false}>Digital
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField='phone' 
            // isKey={true} 
            dataAlign='center' 
            width='50px'
            dataSort={false}>Phone
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField='other' 
            // isKey={true} 
            dataAlign='center' 
            width='50px'
            dataSort={false}>Other
          </TableHeaderColumn>
      </BootstrapTable>
  );
};
// }

CommTable.propTypes = {
  communications: PropTypes.array,
  onCheckboxChange: PropTypes.func,
  onTextChange: PropTypes.func,
};

export default CommTable;
