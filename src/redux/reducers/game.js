import { GAME_ACTIONS, LOBBY_ACTIONS } from '../actions';

const initialSelectState = {
  selectedGame: 'Paint',
  connectionType: 'join',
};

const initialLobbyState = {
  clientList: {},
  lobbyId: '',
};

export const gameSelectReducer = (state = initialSelectState, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SELECT: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }
    case GAME_ACTIONS.SELECT_CONNECTION_TYPE: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }
    default: {
      return state;
    }
  }
};

export const gameLobbyReducer = (state = initialLobbyState, action) => {
  switch (action.type) {
    case LOBBY_ACTIONS.SET_LOBBY: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
