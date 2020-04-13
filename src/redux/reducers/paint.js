import { PAINT_ACTIONS } from '../actions';

const initialState = {
  selectedColor: '#000000',
  brushSize: 5,
};

export const paintReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAINT_ACTIONS.SET_COLOR: {
      return Object.assign({}, state, {
        selectedColor: action.payload,
      });
    }
    case PAINT_ACTIONS.SET_BRUSH_SIZE: {
      return Object.assign({}, state, {
        brushSize: action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
