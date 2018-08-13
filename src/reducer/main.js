import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';

export default combineReducers({
  token,
  role,
  profile,
});
