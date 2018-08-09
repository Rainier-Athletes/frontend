import React from 'react';
import { render } from 'react-dom';
import ReactTable from 'react-table';
import { makeData, Tips } from '../../lib/utils';
import './point-tracker-table.scss';

export default class PointTrackerTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: makeData(),
    };
  }

  render() {
    const { data } = this.state;
    return (
        <div>
          <ReactTable
          data={data}
          columns={[
            {
              Header: 'Name',
              columns: [
                {
                  Header: 'First Name',
                  accessor: 'firstName',
                },
                {
                  Header: 'Last Name',
                  id: 'lastName',
                  accessor: d => d.lastName,
                },
              ],
            },
            {
              Header: 'Info',
              columns: [
                {
                  Header: 'Age',
                  accessor: 'age',
                },
                {
                  Header: 'Status',
                  accessor: 'status',
                },
              ],
            },
            {
              Header: 'Stats',
              columns: [
                {
                  Header: 'Visits',
                  accessor: 'visits',
                },
              ],
            },
          ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />
          <Tips />
          <Logo />
        </div>
    );
  }
}

render(<App />, document.getElementById('root'));
