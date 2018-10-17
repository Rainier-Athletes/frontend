import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setStudentData = studentData => ({
  type: 'STUDENT_DATA_SET',
  payload: { ...studentData, waitingOnSave: false },
});

export const setWaitingOnSave = () => ({
  type: 'STUDENT_DATA_WAITING_ON_SAVE',
});

export const setBulkStudentData = studentDataArray => ({
  type: 'STUDENT_DATA_BULK_SET',
  payload: studentDataArray,
});

export const createStudentData = studentData => (store) => {
  const { token } = store.getState();

  return superagent.post(`${API_URL}${routes.STUDENT_DATA_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(studentData)
    .then((res) => {
      return store.dispatch(setStudentData(res.body));
    })
    .catch((err) => {
      console.error('createStudentData error:', err);
    });
};

export const fetchBulkStudentData = () => (store) => { // eslint-disable-line
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.STUDENT_DATA_ROUTE}/all`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((res) => {
      return store.dispatch(setBulkStudentData(res.body));
    })
    .catch((err) => {
      console.error('fetchBulkStudentData error:', err);
    });
};

export const fetchStudentData = studentId => (store) => { // eslint-disable-line
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.STUDENT_DATA_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query({ _id: studentId })
    .then((res) => {
      const studentData = res.body[0];
      return store.dispatch(setStudentData(studentData));
    })
    .catch((err) => {
      console.error('fetchBulkStudentData error:', err);
    });
};

export const updateStudentData = studentData => (store) => {
  const { token } = store.getState();
  const ptId = studentData.lastPointTracker._id || '';

  return superagent.put(`${API_URL}${routes.STUDENT_DATA_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({ ...studentData, lastPointTracker: ptId })
    .then((res) => {
      return store.dispatch(setStudentData(res.body));
    })
    .catch((err) => {
      console.error('updateStudentData error:', err);
    });
};
