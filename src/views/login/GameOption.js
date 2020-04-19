import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

import { selectGame } from '../../redux/actions';
import { gamesDescription } from '../../constants';
import { connect } from 'react-redux';

class GameOption extends React.Component {
  renderGameButton() {
    return (
      <div className="gameOptionHeader">
        <span className="gameOptionHeaderText">{this.props.gameName}</span>
      </div>
    );
  }

  gameOptionClicked = () => {
    this.props.selectGame({ selectedGame: this.props.gameName });
  };

  render() {
    const selectedGame = gamesDescription[this.props.gameName];
    return (
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://knowpathology.com.au/app/uploads/2018/07/Happy-Test-Screen-01-825x510.png"
          alt={`${selectedGame.name} Slide`}
          style={{ width: '400px', height: '400px' }}
        />
        <Carousel.Caption>
          <h3>{selectedGame.name}</h3>
          <p>{selectedGame.desc}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { selectGame })(GameOption);
