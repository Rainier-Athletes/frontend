import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TooltipItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const tooltip = (
      <Tooltip id={this.props.id}>
        {this.props.text}
      </Tooltip>
    );

    return (
      <React.Fragment>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <FontAwesomeIcon icon="info-circle"/>
        </OverlayTrigger>
      </React.Fragment>
    );
  }
}

export default TooltipItem;
