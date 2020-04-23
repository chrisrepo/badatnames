import React from 'react';
import { connect } from 'react-redux';
import { setColor, setHexColor, setBrushSize } from '../../../redux/actions';
import { colorValueMap, colorList } from '../../../constants';
import HexColorSelector from './HexColorSelector';

class ColorSelector extends React.Component {
  constructor(props) {
    super(props);
    this.colors = {
      colorValueMap,
      colorList,
    };
  }

  colorButtonClicked = (hexValue) => {
    this.props.setColor(hexValue);
    this.props.setHexColor(hexValue);
  };

  getColorList = () => {
    const colorMap = this.colors.colorValueMap;
    return this.colors.colorList.map((colorName, index) => {
      const hexValue = colorMap[colorName];
      const isSelected = hexValue === this.props.paint.selectedColor;
      const className = `color-button${isSelected ? ' selected' : ''}`;
      return (
        <div
          key={index}
          className={className}
          style={{ backgroundColor: hexValue }}
          onClick={() => this.colorButtonClicked(hexValue)}
        ></div>
      );
    });
  };

  render() {
    return (
      <div className="color-container">
        <div className="color-header">Palette</div>
        <div className="color-button-container">{this.getColorList()}</div>
        {<HexColorSelector />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  paint: state.paintGame,
});
export default connect(mapStateToProps, {
  setColor,
  setHexColor,
  setBrushSize,
})(ColorSelector);
