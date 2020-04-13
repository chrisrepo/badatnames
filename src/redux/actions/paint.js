// Action Constants

const actionPrefix = 'PAINT/';

export const PAINT_ACTIONS = {
  SET_COLOR: `${actionPrefix}SET_COLOR`,
  SET_BRUSH_SIZE: `${actionPrefix}SET_BRUSH_SIZE`,
};

// Action Functions

export const setColor = (hexColor) => ({
  type: PAINT_ACTIONS.SET_COLOR,
  payload: hexColor,
});

export const setBrushSize = (size) => ({
  type: PAINT_ACTIONS.SET_BRUSH_SIZE,
  payload: size,
});
