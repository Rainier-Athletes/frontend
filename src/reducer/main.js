import { combineReducers } from 'redux';
import token from './token';
import role from './role';
import profile from './profile';
import myProfile from './myProfile';
import pointTracker from './point-tracker';
import pointTrackers from './point-trackers';
import synopsisReportLink from './synopsis-report';
import studentData from './student-data';
import students from './students';
import teachers from './teachers';
import myStudents from './myStudents';
import csvExtractLink from './extract';

export default combineReducers({
  profile,
  students,
  teachers,
  pointTracker,
  pointTrackers,
  myStudents,
  synopsisReportLink,
  csvExtractLink,
  studentData,
  myProfile,
  role,
  token,
});
