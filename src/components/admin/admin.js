import React from 'react';
import MentorTable from '../mentor-table/mentor-table';
import StudentTable from '../student-table/student-table';
import TableMenu from '../table-menu/table-menu';
// import Whitelist from '../whitelist/whitelist';

class Admin extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TableMenu />
        <MentorTable />
      </React.Fragment>
    );
  }
}

export default Admin;
