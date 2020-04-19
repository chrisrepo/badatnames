// Action Constants

const actionPrefix = 'PONG/';

export const PONG_ACTIONS = {
  TOGGLE: `${actionPrefix}TOGGLE`,
  SET_PLAYERS: `${actionPrefix}SET_PLAYERS`,
  SET_SCORE: `${actionPrefix}SET_SCORE`,
};
// Action Functions

export const togglePong = () => ({
  type: PONG_ACTIONS.TOGGLE,
});
