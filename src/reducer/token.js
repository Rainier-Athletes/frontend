import { cookieFetch } from '../lib/utils';

const TOKEN_KEY = 'RaToken';
const token = cookieFetch(TOKEN_KEY);
console.log(token);
const defaultState = token || null;

export default (state = defaultState, { type, payload }) => {
  console.log(token);
  switch (type) {
    case 'TOKEN_SET':
      return payload;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
