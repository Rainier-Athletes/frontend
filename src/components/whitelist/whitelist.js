import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Invite from '../invite/invite';
import * as whitelistActions from '../../actions/whitelist';

import './whitelist.scss';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  fetchWhitelist: email => dispatch(whitelistActions.fetchWhitelistReq(email)),
  addWhitelist: (...info) => dispatch(whitelistActions.addWhitelistReq(...info)),
});

class WhiteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invites: [],
      modalShow: false,
      email: '',
      firstName: '',
      lastName: '',
    };
  }

  componentDidMount = () => {
    this.props.fetchWhitelist()
      .then((res) => {
        this.setState({ invites: res.payload });
      });
  };

  handleModalShow = () => {
    this.setState({
      modalShow: true,
    });
  }

  handleSubmit = () => {
    const { email, firstName, lastName } = this.state;
    this.props.addWhitelist(email, firstName, lastName)
      .then((res) => {
        console.log(res.payload);
        // this.setState({ emails: res.body });
      });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    console.log('hello', value);
    this.setState({
      [name]: value,
    });
  }

  showPending = () => {
    const { invites } = this.state;
    return (
      <React.Fragment>
        {
          invites.filter(invite => invite.pending === true).map((invite) => {
            return <Invite key={ invite._id } email={ invite.email }/>
          })
        }
      </React.Fragment>
    );
  };

  renderModal = (bool) => {
    if (bool) {
      return (
        <div className="modal-background">
          <div className="whitelist-modal">
            <form className="whitelist-form" onSubmit={ this.handleSubmit }>
              <input
                name="email"
                placeholder="email"
                type="email"
                value={ this.state.email }
                onChange={ this.handleChange }
              />
              <input
                name="firstName"
                placeholder="firstName"
                type="text"
                value={ this.state.firstName }
                onChange={ this.handleChange }
              />
              <input
                name="lastName"
                placeholder="lastName"
                type="text"
                value={ this.state.lastName }
                onChange={ this.handleChange }
              />
              <button type="submit">Send Invite</button>
            </form>


            <div className="modal-pending">
              <p>Pending</p>
              {
                this.showPending()
              }
            </div>

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
