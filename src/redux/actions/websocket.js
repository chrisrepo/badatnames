// Action Constants

const actionPrefix = 'WEBSOCKET/';

export const WEBSOCKET_ACTIONS = {
  CONNECT: `${actionPrefix}CONNECT`,
};

// Action Functions

export const setWebsocketConnection = (websocket) => ({
  type: WEBSOCKET_ACTIONS.CONNECT,
  payload: websocket,
});
