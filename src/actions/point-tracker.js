import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setPointTracker = pointTracker => ({
  type: 'POINT_TRACKER_SET',
  payload: pointTracker,
});

export const createPointTracker = pointTracker => (store) => {
  console.log('CREATE POINT TRACKER FIRING');
  const { token } = store.getState();
  return superagent.post(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(pointTracker)
    .then((res) => {
      console.log(res.body, 'RESPONSE AFTER CREATE POINT TRACKER');
      return store.dispatch(setPointTracker(res.body));
    });
};

export const fetchStudents = studentIds => (store) => {
  const { token } = store.getState();
  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((response) => {
      const profiles = response.body;
      const students = profiles.filter(profile => profile.role === 'student');
      return students;
    })
    .catch(console.error);
};

// TODO: FINISH THIS ROUTE
export const fetchLastPointTracker = studentId => (store) => {
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((response) => {
      console.log(response.body, 'POINT TRACKER RESPONSE');
    })
    .catch(console.error);
};
