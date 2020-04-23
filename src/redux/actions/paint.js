// Action Constants

const actionPrefix = 'PAINT/';

export const PAINT_ACTIONS = {
  SET_COLOR: `${actionPrefix}SET_COLOR`,
  SET_HEX_COLOR: `${actionPrefix}SET_HEX_COLOR`,
  SET_BRUSH_SIZE: `${actionPrefix}SET_BRUSH_SIZE`,
};

// Action Functions

export const setColor = (hexColor) => ({
  type: PAINT_ACTIONS.SET_COLOR,
  payload: hexColor,
});

// For custom hex color selector (will always change this, and on a valid hex color, will actually change the `setColor`)
export const setHexColor = (hexColor) => ({
  type: PAINT_ACTIONS.SET_HEX_COLOR,
  payload: hexColor,
});

export const setBrushSize = (size) => ({
  type: PAINT_ACTIONS.SET_BRUSH_SIZE,
  payload: size,
});
