import { WEBSOCKET_ACTIONS } from '../actions';

const initialState = {
  websocket: null,
};

export const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_ACTIONS.CONNECT: {
      return Object.assign({}, state, {
        websocket: action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
