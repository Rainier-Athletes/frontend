import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setRelationship = profiles => ({
  type: 'RELATIONSHIP_SET',
  payload: profiles,
});

export const deleteRelationship = profiles => ({
  type: 'RELATIONSHIP_DELETE',
  payload: profiles,
});

export const setRelationshipReq = profiles => (store) => {
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.ATTACH_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query(profiles)
    .then(() => {
      window.location.reload();
    });
};

export const deleteRelationshipReq = profiles => (store) => {
  const { token } = store.getState();
  console.log(profiles);
  return superagent.get(`${API_URL}${routes.DETACH_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query(profiles)
    .then(() => {
      window.location.reload();
    });
};
