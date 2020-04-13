import { USER_ACTIONS } from '../actions';

const initialState = {
  userId: '',
  username: '',
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }
    default: {
      return state;
    }
  }
};
