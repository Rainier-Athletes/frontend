import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setWhitelist = email => ({
  type: 'WHITELIST_SET',
  payload: email,
});

export const addWhitelistReq = (email, firstName, lastName) => (store) => {
  const { token } = store.getState();
  return superagent.post(`${API_URL}${routes.WHITELIST_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({ email, firstName, lastName })
    .then((res) => {
      return store.dispatch(setWhitelist(res.body));
    });
};

export const fetchWhitelistReq = () => (store) => {
  console.log('fetch');
  const { token } = store.getState();
  return superagent.get(`${API_URL}${routes.WHITELIST_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return store.dispatch(setWhitelist(res.body));
    });
};
