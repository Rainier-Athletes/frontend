import React from 'react';
import MentorTable from '../mentor-table/mentor-table';
import Whitelist from '../whitelist/whitelist';

class Admin extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Whitelist />
        <MentorTable />
      </React.Fragment>
    );
  }
}

export default Admin;
