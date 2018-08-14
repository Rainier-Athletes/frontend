import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';
import myProfile from './myProfile';

export default combineReducers({
  token,
  role,
  profile,
  myProfile,
});
