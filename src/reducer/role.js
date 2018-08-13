import { cookieFetch } from '../lib/utils';

const ROLE_KEY = 'RaUser';
const role = cookieFetch(ROLE_KEY);
const defaultState = role || null;

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'ROLE_SET':
      return payload;
    case 'ROLE_REMOVE':
      return null;
    default:
      return state;
  }
};
