// Action Constants

const actionPrefix = 'GAME/';

export const GAME_ACTIONS = {
  SELECT: `${actionPrefix}SELECT`,
};

// Action Functions

export const selectGame = (game) => ({
  type: GAME_ACTIONS.SELECT,
  payload: game,
});
