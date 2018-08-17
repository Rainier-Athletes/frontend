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
  <style>
    img{  
    width: 200px;
    }
    .image{  
    padding-left:10px;
    padding-top: 10px;
    padding-bottom:10px;
    height: 20px;
    background: #1f1f1f;
    width: 500px;
    border-radius: 30px;
    }
    body {
        padding: 20px;
        margin: 20px;
        border-radius: 30px;
        border: 2px solid #e8e8e8;

    }
    h1, h2, h3, p {
        font-style:bold;
        font-family: helvetica;
        color:#089444;
    ;
    }
    p {
        font-family: Arial;
        color:#1186B4;
    }
    </style>
    <body>
      <h1>${pointTracker.studentName}</h1>
      <p>${pointTracker.synopsisComments.extraPlayingTime}</p>
      <p>${pointTracker.synopsisComments.mentorGrantedPlayingTime}</p>
      <p>${pointTracker.synopsisComments.studentActionItems}</p>
      <p>${pointTracker.synopsisComments.sportsUpdate}</p>
      <p>${pointTracker.synopsisComments.additionalComments}</p>
    </body>
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
