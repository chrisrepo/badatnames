export const canvasContainerRef = 'canvasContainer';
export const colorList = [
  'RED',
  'PINK',
  'BLUE',
  'GREEN',
  'LIGHT_GREEN',
  'YELLOW',
  'PURPLE',
  'ORANGE',
  'BROWN',
  'WHITE',
  'BLACK',
  'GREY',
];

export const colorValueMap = {
  RED: '#FF0000',
  PINK: '#FFC0CB',
  BLUE: '#0000FF',
  GREEN: '#008000',
  LIGHT_GREEN: '#66FF00',
  YELLOW: '#FFFF00',
  PURPLE: '#800080',
  ORANGE: '#FFA500',
  BROWN: '#8B4513',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREY: '#808080',
};

export const brushSizes = [5, 15, 25];
export const brushCursorOffset = {
  5: 2,
  15: 9,
  25: 15,
};
export const brushSelectedMarginTop = [-2, 4, 10];

export const getbrushContrastColor = (color) => {
  if (color === colorValueMap.BLACK) {
    return '#03fc0b';
  }
  return '#000000';
};
