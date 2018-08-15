import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';
import myProfile from './myProfile';
import pointTracker from './point-tracker';

export default combineReducers({
  token,
  role,
  profile,
  myProfile,
  pointTracker,
});
