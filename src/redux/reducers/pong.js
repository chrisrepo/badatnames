import { PONG_ACTIONS } from '../actions';

const initialState = {
  showUI: false,
  score: {
    left: 0,
    right: 0,
  },
};

export const pongReducer = (state = initialState, action) => {
  switch (action.type) {
    case PONG_ACTIONS.TOGGLE: {
      return Object.assign({}, state, {
        showUI: !state.showUI,
      });
    }
    case PONG_ACTIONS.SET_SCORE: {
      window.console.log('set score redux', action);
      return Object.assign({}, state, {
        score: action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
