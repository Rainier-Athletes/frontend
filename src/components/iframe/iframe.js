import React from 'react';

import './iframe.scss';

export default class Iframe extends React.Component {
  render() {
    return (
      <React.Fragment>
        <iframe className="iframe" src="https://www.rainierathletes.org"></iframe>
      </React.Fragment>
    );
  }
}
