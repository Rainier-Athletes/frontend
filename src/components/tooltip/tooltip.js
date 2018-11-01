import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './tooltip.scss';

function TooltipItem(props) {
  const tooltip = (
    <Tooltip id={props.id}>
      {props.text}
    </Tooltip>
  );

  return (
    <React.Fragment>
      <OverlayTrigger 
        placement="top" 
        overlay={tooltip}
        delayShow={500}
        delayHide={100}
        className="tooltip">
        <FontAwesomeIcon icon="info-circle"/>
      </OverlayTrigger>
    </React.Fragment>
  );
}

TooltipItem.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
};

export default TooltipItem;
