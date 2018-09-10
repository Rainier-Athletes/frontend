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
    .then((res) => {
      console.log(res.body);
      // return store.dispatch(setRe(response.body));
    });
};

// export const updateProfileReq = profile => (store) => {
//   const { token } = store.getState();
//
//   return superagent.put(`${API_URL}${routes.PROFILE_ROUTE}`)
//     .set('Authorization', `Bearer ${token}`)
//     .set('Content-Type', 'application/json')
//     .send(profile)
//     .then((response) => {
//       return store.dispatch(setProfile(response.body));
//     });
// };
//
// export const fetchProfileReq = () => (store) => {
//   const { token } = store.getState();
//
//   return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
//     .set('Authorization', `Bearer ${token}`)
//     .then((res) => {
//       return store.dispatch(setProfile(res.body));
//     });
// };
//
// export const fetchMyProfileReq = () => (store) => {
//   const { token } = store.getState();
//
//   return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}/me`)
//     .set('Authorization', `Bearer ${token}`)
//     .then((res) => {
//       return store.dispatch(setMyProfile(res.body));
//     });
// };

export const deleteRelationshipReq = profiles => (store) => {
  const { token } = store.getState();

  return superagent.delete(`${API_URL}${routes.DETACH_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profiles)
    .then((res) => {
      console.log(res);
      // return store.dispatch(deleteProfile(res.body));
    });
};
