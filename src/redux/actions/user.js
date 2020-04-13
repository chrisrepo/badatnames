// Action Constants

const actionPrefix = 'USER/';

export const USER_ACTIONS = {
  SET: `${actionPrefix}SET`,
};

// Action Functions

export const setUser = (user) => ({
  type: USER_ACTIONS.SET,
  payload: user,
});
