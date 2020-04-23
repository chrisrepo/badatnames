import React from 'react';
import { connect } from 'react-redux';
import { setBrushSize } from '../../../redux/actions';
import { brushSizes, brushSelectedMarginTop } from '../../../constants';

class BrushSelector extends React.Component {
  getBrushList = () => {
    return brushSizes.map((size, index) => {
      const style = {
        height: `${size * 1.25}px`,
        width: `${size * 1.25}px`,
      };
      const isSelected = size === this.props.paint.brushSize;
      return (
        <div
          className={`brush-button-container${index}`}
          key={index}
          onClick={() => this.props.setBrushSize(size)}
        >
          <div className="brush-button" style={style}>
            {isSelected ? (
              <span
                className="selected"
                style={{ marginTop: brushSelectedMarginTop[index] }}
              ></span>
            ) : null}
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="brush-container">
        <div className="brush-header">Brush Size</div>
        <div id="brush-list-container">{this.getBrushList()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  paint: state.paintGame,
});
export default connect(mapStateToProps, {
  setBrushSize,
})(BrushSelector);
