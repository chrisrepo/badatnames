import React, { Component } from 'react';
import { connect } from 'react-redux';
import PaintCursor from './PaintCursor';

import { canvasContainerRef } from '../../constants';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  componentDidMount() {
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    if (this.props.connection.websocket !== null) {
      this.initializeWebsocketPaintListener();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.connection.websocket &&
      prevProps.connection.websocket === null
    ) {
      this.initializeWebsocketPaintListener();
    }
  }

  initializeWebsocketPaintListener() {
    window.console.log('initialize paint');
    this.props.connection.websocket.on('emit-paint', (data) => {
      const { userId, line, color } = data;
      if (userId !== this.props.user.userId) {
        line.forEach((position) => {
          this.paint(position.start, position.stop, color);
        });
      }
    });
  }

  isPainting = false;
  sentPaintData = false;
  line = [];
  prevPos = { offsetX: 0, offsetY: 0 };
  lineCountStart = 0;
  maxPaintTime = 150;
  startTime = null;

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
    this.lineCountStart = 0;
    this.startTime = new Date();
    this.ctx.lineWidth = this.props.paint.brushSize;
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const offSetData = this.addPositionToLine(nativeEvent);
      this.paint(this.prevPos, offSetData, this.props.paint.selectedColor);
    }
  }

  endPaintEvent({ nativeEvent }) {
    if (this.isPainting) {
      if (this.line.length === 0 && !this.sentPaintData) {
        const offSetData = this.addPositionToLine(nativeEvent);
        this.paint(this.prevPos, offSetData, this.props.paint.selectedColor);
      }
      this.isPainting = false;
      this.sendPaintData(
        this.lineCountStart - 1,
        this.line.length - this.lineCountStart
      );
      this.line = [];
    }
    this.sentPaintData = false;
  }

  addPositionToLine(nativeEvent) {
    const { offsetX, offsetY } = nativeEvent;
    const offSetData = { offsetX, offsetY };
    this.position = {
      start: { ...this.prevPos },
      stop: { ...offSetData },
    };
    this.line = this.line.concat(this.position);
    return offSetData;
  }

  paint(prevPos, currPos, color) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
    const timeDiff = new Date() - this.startTime;
    if (this.line.length > 50 || timeDiff > this.maxPaintTime) {
      this.sendPaintData();
      this.line = [];
    }
  }

  sendPaintData() {
    this.sentPaintData = true;
    const body = {
      line: this.line,
      userId: this.props.user.userId,
      color: this.props.paint.selectedColor,
    };
    if (this.props.connection.websocket) {
      this.props.connection.websocket.emit('on-paint', body);
    } else {
      throw Error('Cannot send paint data - Web socket is undefined');
    }
  }

  render() {
    return (
      <div id={canvasContainerRef} style={{ cursor: 'none' }}>
        <PaintCursor containerRef={canvasContainerRef} />
        <canvas
          ref={(ref) => (this.canvas = ref)}
          style={{ background: 'white', border: '1px solid black' }}
          onMouseDown={this.onMouseDown}
          onMouseLeave={(e) => this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  user: state.user,
  paint: state.paintGame,
});
export default connect(mapStateToProps, {})(Canvas);
