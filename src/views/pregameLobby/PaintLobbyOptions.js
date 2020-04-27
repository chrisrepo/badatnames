import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import './LobbyView.css';

class PaintLobbyOptions extends React.Component {
  state = {
    maxTime: 90,
    rounds: 3,
  };

  componentDidMount() {
    // Progagate default options to parent
    this.props.setOptions(this.state);
  }

  handleTimeToGuess = (e) => {
    this.setState({ maxTime: e.target.value });
    this.props.setOptions(this.state);
  };

  handleRound = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({ rounds: e.target.value });
      this.props.setOptions(this.state);
    }
  };

  render() {
    return (
      <Container className="paint-lobby-options">
        <label htmlFor="time-to-guess">Time to draw/guess</label>
        <InputGroup>
          <Form.Control
            id="time-to-guess"
            type="text"
            style={{ maxWidth: '10%' }}
            value={this.state.maxTime}
            onChange={this.handleTimeToGuess}
          />
          <InputGroup.Append>
            <InputGroup.Text id="basic-addon2">Seconds</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <Form.Group size="sm">
          <Form.Label>Rounds</Form.Label>
          <Form.Control
            type="text"
            style={{ maxWidth: '10%' }}
            value={this.state.rounds}
            onChange={this.handleTimeToGuess}
          />
        </Form.Group>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
});
export default connect(mapStateToProps, {})(withRouter(PaintLobbyOptions));
