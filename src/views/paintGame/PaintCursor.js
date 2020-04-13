import React from 'react';
import { connect } from 'react-redux';
import { brushCursorOffset } from '../../constants';

import './PaintCursor.css';

class PaintCursor extends React.Component {
  constructor() {
    super();
    this.state = {
      cursorTop: '50%',
      cursorLeft: '50%',
      display: 'none',
    };
  }

  componentDidMount() {
    this.attachMouseMoveListener();
  }

  attachMouseMoveListener() {
    const cursorContainer = document.getElementById(this.props.containerRef);
    cursorContainer.addEventListener('mousemove', (event) => {
      this.setState({
        cursorTop: event.pageY - brushCursorOffset[this.props.paint.brushSize],
        cursorLeft: event.pageX - brushCursorOffset[this.props.paint.brushSize],
      });
    });
    cursorContainer.addEventListener('mouseenter', (event) => {
      this.setState({
        display: 'block',
      });
    });
    cursorContainer.addEventListener('mouseleave', (event) => {
      this.setState({
        display: 'none',
      });
    });
  }

  render() {
    const brushSize = this.props.paint.brushSize * 1.25;
    const cursorStyle = {
      background: this.props.paint.selectedColor,
      height: `${brushSize}px`,
      width: `${brushSize}px`,
      top: this.state.cursorTop,
      left: this.state.cursorLeft,
      display: this.state.display,
    };
    return <div id="paintCursor" style={cursorStyle}></div>;
  }
}

const mapStateToProps = (state) => ({
  paint: state.paintGame,
});
export default connect(mapStateToProps, {})(PaintCursor);
