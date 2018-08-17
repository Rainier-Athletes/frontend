import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setPointTracker = pointTracker => ({
  type: 'POINT_TRACKER_SET',
  payload: pointTracker,
});

export const createPointTracker = pointTracker => (store) => {
  const { token } = store.getState();

  pointTracker.date = new Date(pointTracker.date).toISOString();

  return superagent.post(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(pointTracker)
    .then((res) => {
      return store.dispatch(setPointTracker(res.body));
    });
};

export const createSynopsisReport = pointTracker => (store) => {
  const { token } = store.getState();

  const pointTrackerHTML = `
    <div>
      <p>${pointTracker.synopsisComments.extraPlayingTime}</p>
      <p>${pointTracker.synopsisComments.mentorGrantedPlayingTime}</p>
      <p>${pointTracker.synopsisComments.studentActionItems}</p>
      <p>${pointTracker.synopsisComments.sportsUpdate}</p>
      <p>${pointTracker.synopsisComments.additionalComments}</p>
    </div>
  `;

  const body = {
    name: pointTracker.studentName,
    html: pointTrackerHTML,
  };

  return superagent.post(`${API_URL}${routes.SYNOPSIS_REPORT}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(body)
    .then((res) => {
      return store.dispatch(setPointTracker(res.body));
    });
};

export const fetchStudents = studentIds => (store) => { // eslint-disable-line
  const { token } = store.getState();
  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((response) => {
      const profiles = response.body;
      const students = profiles.filter(profile => profile.role === 'student');
      return students;
    });
};

export const fetchTeachers = studentId => (store) => { // eslint-disable-line
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((response) => {
      const profiles = response.body;
      const teachers = profiles.filter(profile => profile.role === 'teacher');
      return teachers;
    });
};
