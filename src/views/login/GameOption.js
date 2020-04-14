import React from 'react';
import './GameOption.css';

import { selectGame } from '../../redux/actions';
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
    const classes = `gameOption${this.props.selected ? ' selected' : ''}`;
    return (
      <div className={classes} onClick={this.gameOptionClicked}>
        {this.renderGameButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { selectGame })(GameOption);
