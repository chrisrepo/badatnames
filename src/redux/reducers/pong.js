import { PONG_ACTIONS } from '../actions';

const initialState = {
  showUI: false,
};

export const pongReducer = (state = initialState, action) => {
  switch (action.type) {
    case PONG_ACTIONS.TOGGLE: {
      return Object.assign({}, state, {
        showUI: !state.showUI,
      });
    }
    default: {
      return state;
    }
  }
};
