import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setProfile = profile => ({
  type: 'PROFILE_SET',
  payload: profile,
});

export const createProfileReq = profile => (store) => {
  const { token } = store.getState(profile);

  return superagent.post(`${API_URL}${routes.PROFILE}`)
    .set('Authorization', `Bearer ${token}`);
};

export default fileDescriptor => (store) => {
  const { token } = store.getState();

  return superagent.post(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`);
};
