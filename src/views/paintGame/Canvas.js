import React, { Component } from 'react';
import { connect } from 'react-redux';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  componentDidMount() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    this.initializeWebsocketPaintListener();
    this.props.websocket.emit('paint-entered-game', {
      lobbyId: this.props.lobby.lobbyId,
    });
    console.log('websocket', this.props.websocket);
  }

  componentDidUpdate(prevProps) {
    if (this.props.websocket && prevProps.websocket === null) {
      window.console.log('update initialize PAINT');
      this.initializeWebsocketPaintListener();
    }
  }

  initializeWebsocketPaintListener() {
    this.props.websocket.on('emit-paint', (data) => {
      const { line, color, brushSize } = data;
      line.forEach((position) => {
        this.paint(position.start, position.stop, color, brushSize);
      });
    });
    this.props.websocket.on('emit-clear-canvas', () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });
  }

  isPainting = false;
  sentPaintData = false;
  line = [];
  lineLength = 0;
  prevPos = { offsetX: 0, offsetY: 0 };
  lineCountStart = 0;
  maxPaintTime = 150;
  startTime = null;

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true && this.props.isCurrentDrawer;
    this.prevPos = { offsetX, offsetY };
    this.lineCountStart = 0;
    this.startTime = new Date();
    this.ctx.lineWidth = this.props.paint.brushSize;
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const offSetData = this.addPositionToLine(nativeEvent);
      this.paint(
        this.prevPos,
        offSetData,
        this.props.paint.selectedColor,
        this.props.paint.brushSize
      );
    }
  }

  endPaintEvent({ nativeEvent }) {
    if (this.isPainting) {
      if (this.lineLength === 0 && !this.sentPaintData) {
        const offSetData = this.addPositionToLine(nativeEvent);
        this.paint(
          this.prevPos,
          offSetData,
          this.props.paint.selectedColor,
          this.props.paint.brushSize
        );
      }
      this.isPainting = false;
      this.sendPaintData(
        this.lineCountStart - 1,
        this.lineLength - this.lineCountStart
      );
      this.line = [];
      this.lineLength = 0;
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
    this.lineLength++;
    return offSetData;
  }

  paint = (prevPos, currPos, color, brushSize) => {
    this.ctx.lineWidth = brushSize;

    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
    this.sendPaintData(); // TODO: Keep an eye on this for performance issues
    this.line = [];
    this.lineLength = 0;
  };

  sendPaintData = () => {
    this.sentPaintData = true;
    const body = {
      line: this.line,
      color: this.props.paint.selectedColor,
      brushSize: this.props.paint.brushSize,
      lobbyId: this.props.lobby.lobbyId,
    };
    this.props.websocket.emit('on-paint', body);
  };

  render() {
    return (
      <canvas
        ref={(ref) => (this.canvas = ref)}
        style={{ background: 'white', boxShadow: ' 1px 1px 5px #9a9a9a' }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  websocket: state.connection.websocket,
  lobby: state.lobby,
  user: state.user,
  paint: state.paintGame,
});
export default connect(mapStateToProps, {})(Canvas);
