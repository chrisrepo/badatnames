import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import GameSelector from './GameSelector';
import { setUser, setLobby } from '../../redux/actions';
import { gamesMap } from '../../constants';
import './Login.css';
// Local Imports
import JoinSelector from './JoinSelector';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', lobbyId: '', error: undefined };
  }

  componentDidMount() {
    this.props.connection.websocket
      .off('emit-join-lobby')
      .on('emit-join-lobby', (data) => {
        if (data.error) {
          this.setState({
            error: data.error,
          });
          return;
        } else {
          const lobbyId = data.lobbyId;
          const lobby = data.lobby;
          const setLobbyObj = {
            ...lobby,
          };
          if (lobbyId) {
            setLobbyObj.lobbyId = lobbyId;
          }
          this.props.setLobby({
            ...setLobbyObj,
          });
          // Join game or join lobby
          if (lobby.started) {
            const route = gamesMap[this.props.gameSelector.selectedGame];
            this.props.history.push(route);
          } else {
            this.props.history.push('/lobby');
          }
        }
      });
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleLobbyIdChange = (event) => {
    this.setState({ lobbyId: event.target.value });
  };

  validInputs = () => {
    const type = this.props.gameSelector.connectionType;
    if (type === 'join' && this.state.lobbyId.length === 0) {
      this.setState({ error: 'Lobby Code cannot be blank when joining game' });
      return false;
    } else if (this.state.username.length === 0) {
      this.setState({ error: 'Username cannot be blank' });
      return false;
    }
    return true;
  };

  goButtonClicked = () => {
    const type = this.props.gameSelector.connectionType;
    let body = {};
    if (!this.validInputs()) {
      return;
    }
    if (type === 'join' && this.state.lobbyId.length > 0) {
      body = {
        game: this.props.gameSelector.selectedGame,
        username: this.state.username,
        lobbyId: this.state.lobbyId,
      };
    } else {
      body = {
        game: this.props.gameSelector.selectedGame,
        username: this.state.username,
      };
    }
    // Reset error state
    this.setState({
      error: undefined,
    });
    this.props.connection.websocket.emit(`${type}-lobby`, body);
  };

  renderError = () => {
    return (
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Alert variant="danger">{this.state.error}</Alert>
        </Col>
      </Row>
    );
  };

  renderLobbyCodeInput = () => {
    const selectedGame = this.props.gameSelector.selectedGame;
    return (
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form.Group>
            <Form.Label>Lobby Code</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  {selectedGame}-
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text" onChange={this.handleLobbyIdChange} />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    );
  };

  renderUserInput = () => {
    return (
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" onChange={this.handleUsernameChange} />
          </Form.Group>
        </Col>
      </Row>
    );
  };

  render() {
    const selectedGame = this.props.gameSelector.selectedGame;
    const goButtonText = `Play ${selectedGame}`;
    return (
      <div className="main-page-wrapper">
        <div id="gameSelectorContainer">
          <GameSelector />
        </div>
        <JoinSelector />
        <Container className="inputContainer" fluid="md">
          {this.renderUserInput()}
          {this.props.gameSelector.connectionType === 'join' &&
            this.renderLobbyCodeInput()}
          {this.state.error && this.renderError()}
          <Row>
            <Col md={{ span: 2, offset: 4 }}>
              <button
                className="btn btn-success"
                onClick={() => this.goButtonClicked()}
              >
                {goButtonText}
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, { setUser, setLobby })(
  withRouter(Login)
);
