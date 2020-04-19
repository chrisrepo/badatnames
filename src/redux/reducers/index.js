import { combineReducers } from 'redux';
import { websocketReducer } from './websocket';
import { userReducer } from './user';
import { paintReducer } from './paint';
import { pongReducer } from './pong';

import { gameSelectReducer, gameLobbyReducer } from './game';

export const rootReducer = combineReducers({
  connection: websocketReducer,
  user: userReducer,
  paintGame: paintReducer,
  pongGame: pongReducer,
  gameSelector: gameSelectReducer,
  lobby: gameLobbyReducer,
});
