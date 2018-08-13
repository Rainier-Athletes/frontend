import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setProfile = profile => ({
  type: 'PROFILE_SET',
  payload: profile,
});

export const createProfileReq = profile => (store) => {
  const { token } = store.getState();
  return superagent.post(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profile)
    .then((res) => {
      return store.dispatch(setProfile(res.body));
    });
};

export const updateProfileReq = profile => (store) => {
  const { token } = store.getState();
  return superagent.put(`${API_URL}${routes.PROFILE_ROUTE}/${profile._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profile)
    .then((res) => {
      return store.dispatch(setProfile(res.body));
    });
};

export const fetchProfileReq = () => (store) => {
  console.log('fetch');
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      console.log(res.body);
      return store.dispatch(setProfile(res.body));
    });
};
