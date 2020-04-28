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
    this.props.setOptions({
      maxTime: parseInt(e.target.value),
      rounds: parseInt(this.state.rounds),
    });
  };

  handleRound = (e) => {
    this.setState({ rounds: e.target.value });
    this.props.setOptions({
      maxTime: parseInt(this.state.maxTime),
      rounds: parseInt(e.target.value),
    });
  };

  render() {
    return (
      <Container className="paint-lobby-options">
        <label htmlFor="time-to-guess">Time to draw/guess</label>
        <InputGroup>
          <Form.Control
            id="time-to-guess"
            type="number"
            min="10"
            max="120"
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
            type="number"
            min="1"
            max="10"
            style={{ maxWidth: '10%' }}
            value={this.state.rounds}
            onChange={this.handleRound}
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
