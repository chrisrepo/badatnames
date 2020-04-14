import { GAME_ACTIONS } from '../actions';

const initialState = {
  selectedGame: 'Paint',
};

export const gameSelectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SELECT: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
