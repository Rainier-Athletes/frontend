import superagent from 'superagent';
import * as routes from '../lib/routes';

const setProfile = profile => ({
  type: 'PROFILE_SET',
  payload: profile,
});

const setMyProfile = profile => ({
  type: 'MY_PROFILE_SET',
  payload: profile,
});

const deleteProfile = profile => ({
  type: 'PROFILE_DELETE',
  payload: profile,
});

const setStudents = students => ({
  type: 'STUDENTS_SET',
  payload: students,
});

const setTeachers = teachers => ({
  type: 'TEACHERS_SET',
  payload: teachers,
});

export const createProfileReq = profile => (store) => {
  const { token } = store.getState();

  return superagent.post(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profile)
    .then((response) => {
      return store.dispatch(setProfile(response.body));
    });
};

export const updateProfileReq = profile => (store) => {
  const { token } = store.getState();

  return superagent.put(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profile)
    .then((response) => {
      return store.dispatch(setProfile(response.body));
    });
};

export const fetchProfileReq = () => (store) => {
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return store.dispatch(setProfile(res.body));
    });
};

export const fetchMyProfileReq = () => (store) => {
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}/me`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return store.dispatch(setMyProfile(res.body));
    });
};

export const deleteProfileReq = profile => (store) => {
  const { token } = store.getState();

  return superagent.delete(`${API_URL}${routes.PROFILE_ROUTE}?id=${profile._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(profile)
    .then((res) => {
      console.log(res);
      return store.dispatch(deleteProfile(res.body));
    });
};

export const fetchStudents = studentIds => (store) => { // eslint-disable-line
  const { token } = store.getState();
  return superagent.get(`${API_URL}${routes.PROFILE_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((res) => {
      const profiles = res.body;
      const students = profiles.filter(profile => profile.role === 'student');
      return store.dispatch(setStudents(students));
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
      return store.dispatch(setTeachers(teachers));
    });
};
