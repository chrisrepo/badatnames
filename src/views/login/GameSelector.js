import React from 'react';
import { connect } from 'react-redux';
import './GameSelector.css';
import GameOption from './GameOption';
import { gamesMap, gamesDescription } from '../../constants';

class GameSelector extends React.Component {
  renderGamesList() {
    return Object.keys(gamesMap).map((key, index) => {
      const isSelected = this.props.gameSelector.selectedGame === key;
      return <GameOption gameName={key} key={index} selected={isSelected} />;
    });
  }

  render() {
    const selectedGame = gamesDescription[this.props.gameSelector.selectedGame];
    return (
      <div id="gameSelectorWrapper">
        <div id="gameSelector">{this.renderGamesList()}</div>
        <div id="gameDescription">
          <div id="gameDescriptionHeader">{selectedGame.name}</div>
          <div id="gameDescriptionText">{selectedGame.desc}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, {})(GameSelector);
