import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';
import myProfile from './myProfile';
import pointTracker from './point-tracker';
import pointTrackers from './point-trackers';
import students from './students';
import teachers from './teachers';
import myStudents from './myStudents';

export default combineReducers({
  token,
  role,
  profile,
  myProfile,
  students,
  teachers,
  pointTracker,
  pointTrackers,
  myStudents,
});
