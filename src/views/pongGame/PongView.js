import React from 'react';
import PongUI from './PongUI';
import PongGame from './PongGame';

export class PongView extends React.Component {
  render() {
    return (
      <div id="pong-container">
        <PongGame />
        <PongUI />
      </div>
    );
  }
}
