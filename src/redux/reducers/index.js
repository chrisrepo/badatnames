import { combineReducers } from 'redux';
import { websocketReducer } from './websocket';
import { userReducer } from './user';
import { paintReducer } from './paint';
import { gameSelectReducer } from './game';

export const rootReducer = combineReducers({
  connection: websocketReducer,
  user: userReducer,
  paintGame: paintReducer,
  gameSelector: gameSelectReducer,
});
