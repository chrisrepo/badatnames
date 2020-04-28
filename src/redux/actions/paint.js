// Action Constants

const actionPrefix = 'PAINT/';

export const PAINT_ACTIONS = {
  SET_COLOR: `${actionPrefix}SET_COLOR`,
  SET_HEX_COLOR: `${actionPrefix}SET_HEX_COLOR`,
  SET_BRUSH_SIZE: `${actionPrefix}SET_BRUSH_SIZE`,
  SET_DRAWING_WORD: `${actionPrefix}SET_DRAWING_WORD`,
  SET_GUESSING_WORD: `${actionPrefix}SET_GUESSING_WORD`,
  SET_CURRENT_DRAWER: `${actionPrefix}SET_CURRENT_DRAWER`,
  SET_SUB_ROUND_STARTED: `${actionPrefix}SET_SUB_ROUND_STARTED`,
  END_CURRENT_SUB_ROUND: `${actionPrefix}END_CURRENT_SUB_ROUND`,
  SET_ROUND: `${actionPrefix}SET_ROUND`,
  SET_TIMER: `${actionPrefix}SET_TIMER`,
  SHOW_SCORE: `${actionPrefix}SHOW_SCORE`,
  SET_HOST_OPTIONS: `${actionPrefix}SET_HOST_OPTIONS`,
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

export const setDrawingWord = (drawingWord) => ({
  type: PAINT_ACTIONS.SET_DRAWING_WORD,
  payload: drawingWord,
});

export const setGuessingWord = (guessingWord) => ({
  type: PAINT_ACTIONS.SET_GUESSING_WORD,
  payload: guessingWord,
});

export const setCurrentDrawer = (isCurrentDrawer) => ({
  type: PAINT_ACTIONS.SET_CURRENT_DRAWER,
  payload: isCurrentDrawer,
});

export const setSubRoundStarted = (started) => ({
  type: PAINT_ACTIONS.SET_SUB_ROUND_STARTED,
  payload: started,
});

export const endCurrentSubRound = () => ({
  type: PAINT_ACTIONS.END_CURRENT_SUB_ROUND,
});

export const setRound = (roundNo) => ({
  type: PAINT_ACTIONS.SET_ROUND,
  payload: roundNo,
});

export const setTimer = (toggle) => ({
  type: PAINT_ACTIONS.SET_TIMER,
  payload: toggle,
});

export const showScore = ({ show, score, roundScore, isGameOver }) => ({
  type: PAINT_ACTIONS.SHOW_SCORE,
  payload: {
    show,
    score,
    roundScore,
    isGameOver,
  },
});

export const setHostOptions = (options) => ({
  type: PAINT_ACTIONS.SET_HOST_OPTIONS,
  payload: options,
});
