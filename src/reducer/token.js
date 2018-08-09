import { cookieFetch } from '../lib/utils';

const defaultState = cookieFetch('_token') || null;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'TOKEN_SET':
      return payload;
    case 'TOKEN_REMOVE':
      return defaultState;
    default: 
      return state;
  }
};
