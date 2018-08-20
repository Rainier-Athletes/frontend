import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';
import myProfile from './myProfile';
// import whitelist from './whitelist';
import pointTracker from './point-tracker';
import students from './students';
import teachers from './teachers';

export default combineReducers({
  token,
  role,
  profile,
  myProfile,
  students,
  teachers,
  // whitelist,
  pointTracker,
});
