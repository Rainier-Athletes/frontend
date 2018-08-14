import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setPointTracker = pointTracker => ({
  type: 'POINT_TRACKER_SET',
  payload: pointTracker,
});

export const createPointTracker = pointTracker => (store) => {
  console.log('CREATE POINT TRACKER FIRING');
  const { token } = store.getState();
  return superagent.post(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(pointTracker)
    .then((res) => {
      console.log(res.body, 'RESPONSE AFTER CREATE POINT TRACKER');
      return store.dispatch(setPointTracker(res.body));
    });
};
