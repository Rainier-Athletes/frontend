import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as whitelistActions from '../../actions/whitelist';

import './whitelist.scss';

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
      modalShow: false,
    };
  }

  componentDidMount = () => {
    this.props.fetchWhitelist()
      .then((res) => {
        console.log(res);
        this.setState({ emails: res.body });
      });
  };

  handleModalShow = () => {
    this.setState({
      modalShow: true,
    });
  }

  handleSubmit = () => {
    this.props.addWhitelist()
      .then((res) => {
        console.log(res);
        this.setState({ emails: res.body });
      });
  }

  renderModal = (bool) => {
    if (bool) {
      return (
        <div className="modal-background">
          <div className="whitelist-modal">
            <h1>invite</h1>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <React.Fragment>
        <button className="whitelist-btn" onClick={ this.handleModalShow }>
          Invite
          <FontAwesomeIcon icon="user-plus" />
        </button>
        {
          this.renderModal(this.state.modalShow)
        }
      </React.Fragment>
    );
  }
}

WhiteList.propTypes = {
  fetchWhitelist: PropTypes.func,
  addWhitelist: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(WhiteList);
