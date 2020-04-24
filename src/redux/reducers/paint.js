import { PAINT_ACTIONS } from '../actions';

const initialState = {
  selectedColor: '#000000',
  selectedHexColor: '#000000',
  brushSize: 5,
  isCurrentDrawer: false,
  drawingWord: '',
  guessingWord: '',
  subRoundStarted: false, // True once user has picked a word to draw, false once draw timer ends
  round: 1,
};

export const paintReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAINT_ACTIONS.SET_COLOR: {
      return Object.assign({}, state, {
        selectedColor: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_HEX_COLOR: {
      return Object.assign({}, state, {
        selectedHexColor: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_BRUSH_SIZE: {
      return Object.assign({}, state, {
        brushSize: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_CURRENT_DRAWER: {
      return Object.assign({}, state, {
        isCurrentDrawer: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_DRAWING_WORD: {
      return Object.assign({}, state, {
        drawingWord: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_GUESSING_WORD: {
      return Object.assign({}, state, {
        guessingWord: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_SUB_ROUND_STARTED: {
      return Object.assign({}, state, {
        subRoundStarted: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_ROUND: {
      return Object.assign({}, state, {
        round: action.payload,
      });
    }
    case PAINT_ACTIONS.END_CURRENT_SUB_ROUND: {
      return Object.assign({}, state, {
        subRoundStarted: false,
        isCurrentDrawer: false,
        drawingWord: '',
        guessingWord: '',
      });
    }
    default: {
      return state;
    }
  }
};
