import React from 'react';
import { Colors } from '../models/Colors';
import './ColorSelector.css';
export class ColorSelector extends React.Component {
  constructor(props) {
    super(props);
    this.colors = new Colors();
  }

  getColorList = () => {
    const colorMap = this.colors.colorValueMap;
    return this.colors.colorList.map((colorName, index) => {
      const hexValue = colorMap[colorName];
      const isSelected = hexValue === this.props.selectedColor;
      const className = 'color-button';
      return (
        <div
          key={index}
          className={className}
          style={{ backgroundColor: hexValue }}
          onClick={() => this.props.changeSelectedColor(hexValue)}
        >
          {isSelected ? <span className="selected"></span> : null}
        </div>
      );
    });
  };

  render() {
    return (
      <div className="palette-wrapper">
        <div className="color-header">Palette</div>
        {this.getColorList()}
      </div>
    );
  }
}
