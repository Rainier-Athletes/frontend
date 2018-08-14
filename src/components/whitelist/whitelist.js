import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as whitelistActions from '../../actions/whitelist';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  fetchWhitelist: email => dispatch(whitelistActions.fetchWhitelistReq(email)),
  addWhitelist: email => dispatch(whitelistActions.addWhitelistReq(email)),
});

class WhiteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
    };
  }

  componentDidMount = () => {
    this.props.fetchWhitelist()
      .then((res) => {
        console.log(res);
        this.setState({ emails: res.body });
      });
  };

  handleClick = () => {
    this.props.addWhitelist()
      .then((res) => {
        console.log(res);
        this.setState({ emails: res.body });
      });
  }

  render() {
    return (
      <button onClick={ this.handleClick }>Add to Org</button>
    );
  }
}

WhiteList.propTypes = {
  fetchWhitelist: PropTypes.func,
  addWhitelist: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(WhiteList);
