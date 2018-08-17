import React from 'react';
import TableMenu from '../table-menu/table-menu';
// import Whitelist from '../whitelist/whitelist';
import { Modal } from '../buttons/buttons';

class Admin extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TableMenu />
        <Modal />
      </React.Fragment>
    );
  }
}

export default Admin;
