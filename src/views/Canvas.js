import React, { Component } from 'react';
import { connect } from 'react-redux';

class Canvas extends Component {
  static defaultProps = {
    selectedColor: '#ffffff',
  };

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
      if (userId !== this.props.userId) {
        line.forEach((position) => {
          this.paint(position.start, position.stop, color);
        });
      }
    });
  }

  isPainting = false;
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
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      this.position = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      this.line = this.line.concat(this.position);
      this.paint(this.prevPos, offSetData, this.props.selectedColor);
    }
  }

  endPaintEvent() {
    if (this.isPainting) {
      if (this.line.length === 0) {
        //TODO:!!
        console.log('dot!');
      }
      this.isPainting = false;
      this.sendPaintData(
        this.lineCountStart - 1,
        this.line.length - this.lineCountStart
      );
      this.line = [];
    }
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
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
    const body = {
      line: this.line,
      userId: this.props.userId,
      color: this.props.selectedColor,
    };
    if (this.props.connection.websocket) {
      this.props.connection.websocket.emit('on-paint', body);
    } else {
      throw Error('Cannot send paint data - Web socket is undefined');
    }
  }

  render() {
    return (
      <canvas
        ref={(ref) => (this.canvas = ref)}
        style={{ background: 'white', border: '1px solid black' }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
});
export default connect(mapStateToProps, {})(Canvas);
