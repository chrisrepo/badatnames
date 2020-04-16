// Action Constants

const actionPrefix = 'GAME/';
const lobbyActionPrefix = 'LOBBY/';

export const GAME_ACTIONS = {
  SELECT: `${actionPrefix}SELECT`,
  SELECT_CONNECTION_TYPE: `${actionPrefix}SELECT_CONNECTION_TYPE`,
};

export const LOBBY_ACTIONS = {
  SET_LOBBY: `${lobbyActionPrefix}SET_LOBBY`,
};

// Action Functions

export const selectGame = (game) => ({
  type: GAME_ACTIONS.SELECT,
  payload: game,
});

export const selectConnectionType = (option) => ({
  type: GAME_ACTIONS.SELECT_CONNECTION_TYPE,
  payload: option,
});

export const setLobby = (list) => ({
  type: LOBBY_ACTIONS.SET_LOBBY,
  payload: list,
});
