import React from 'react';
import { connect } from 'react-redux';

import { setColor, setBrushSize } from '../../redux/actions';
import {
  colorValueMap,
  colorList,
  brushSizes,
  brushSelectedMarginTop,
} from '../../constants';
import './ColorSelector.css';

class ColorSelector extends React.Component {
  constructor(props) {
    super(props);
    this.colors = {
      colorValueMap,
      colorList,
    };
  }

  getColorList = () => {
    const colorMap = this.colors.colorValueMap;
    return this.colors.colorList.map((colorName, index) => {
      const hexValue = colorMap[colorName];
      const isSelected = hexValue === this.props.paint.selectedColor;
      const className = 'color-button';
      return (
        <div
          key={index}
          className={className}
          style={{ backgroundColor: hexValue }}
          onClick={() => this.props.setColor(hexValue)}
        >
          {isSelected ? <span className="selected"></span> : null}
        </div>
      );
    });
  };

  getBrushList = () => {
    return brushSizes.map((size, index) => {
      const style = {
        height: `${size * 1.25}px`,
        width: `${size * 1.25}px`,
      };
      const isSelected = size === this.props.paint.brushSize;
      return (
        <div
          key={index}
          className="brush-button"
          style={style}
          onClick={() => this.props.setBrushSize(size)}
        >
          {isSelected ? (
            <span
              className="selected"
              style={{ marginTop: brushSelectedMarginTop[index] }}
            ></span>
          ) : null}
        </div>
      );
    });
  };

  render() {
    return (
      <div className="palette-wrapper">
        <div className="color-header">Palette</div>
        {this.getColorList()}
        <div className="brush-header">Brush Size</div>
        {this.getBrushList()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  paint: state.paintGame,
});
export default connect(mapStateToProps, { setColor, setBrushSize })(
  ColorSelector
);
