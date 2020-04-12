import { combineReducers } from 'redux';
import { websocketReducer } from './websocket';

export const rootReducer = combineReducers({
  connection: websocketReducer,
});
