import { combineReducers } from 'redux';
import { websocketReducer } from './websocket';
import { userReducer } from './user';
import { paintReducer } from './paint';

export const rootReducer = combineReducers({
  connection: websocketReducer,
  user: userReducer,
  paintGame: paintReducer,
});
