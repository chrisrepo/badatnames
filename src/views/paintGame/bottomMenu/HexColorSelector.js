import React from 'react';
import { connect } from 'react-redux';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { setColor, setHexColor } from '../../../redux/actions';

class HexColorSelector extends React.Component {
  onHexColorChange = (e) => {
    const enteredColor = '#' + e.target.value.toUpperCase();
    if (this.validHexColor(enteredColor)) {
      // Set the color to the new value
      this.props.setColor(enteredColor);
    } else {
      // default back to black
      this.props.setColor('#000000');
    }
    this.props.setHexColor(enteredColor);
  };

  validHexColor = (color) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/;
    const isMatch = color.match(hexRegex);
    return isMatch !== null;
  };

  render() {
    const isValidColor = this.validHexColor(this.props.selectedHexColor);
    const colorNoPound = this.props.selectedHexColor.substring(1);
    return (
      <InputGroup size="sm" className="mb-1 mt-1">
        <InputGroup.Prepend>
          <InputGroup.Text>#</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          onChange={this.onHexColorChange}
          isInvalid={!isValidColor}
          maxLength={6}
          value={colorNoPound}
        />
        <FormControl.Feedback type="invalid">
          Must be a valid hexcode
        </FormControl.Feedback>
      </InputGroup>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedHexColor: state.paintGame.selectedHexColor,
  };
};
export default connect(mapStateToProps, { setColor, setHexColor })(
  HexColorSelector
);
