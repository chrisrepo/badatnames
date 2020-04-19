import React from 'react';
import { connect } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel';

import './GameSelector.css';
import GameOption from './GameOption';
import { gamesMap, gamesDescription } from '../../constants';
import { selectGame } from '../../redux/actions';

class GameSelector extends React.Component {
  state = {
    index: 0,
  };
  setIndex = (selectedIndex) => {
    this.setState({ index: selectedIndex });
  };

  getActiveIndex = () => {
    const selectedGame = gamesDescription[this.props.gameSelector.selectedGame];
    Object.keys(gamesMap).forEach((key, index) => {
      if (key === selectedGame.name) {
        return index;
      }
    });
    return 0;
  };

  onSelectCarouselItem = (selectedIndex, e) => {
    this.setIndex(selectedIndex);
    if (e && e.target) {
      Object.keys(gamesMap).forEach((key, index) => {
        if (index === selectedIndex) {
          this.props.selectGame({ selectedGame: key });
        }
      });
    }
  };

  renderGamesList() {
    return Object.keys(gamesMap).map((key, index) => {
      return (
        <Carousel.Item key={key}>
          <div
            className="btn-secondary"
            style={{ width: '700px', height: '400px' }}
          ></div>
          <Carousel.Caption>
            <h4>{gamesDescription[key].name}</h4>
            <p>{gamesDescription[key].desc}</p>
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  }

  render() {
    const activeIndex = this.getActiveIndex();
    const selectedGame = gamesDescription[this.props.gameSelector.selectedGame];
    window.console.log('selected game', selectedGame, activeIndex);
    return (
      <Carousel
        activeIndex={this.state.index}
        onSelect={this.onSelectCarouselItem}
        interval={null}
      >
        {this.renderGamesList()}
      </Carousel>
    );
  }
}

const mapStateToProps = (state) => ({
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, { selectGame })(GameSelector);
