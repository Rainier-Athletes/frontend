import superagent from 'superagent';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SynopsisReport from '../components/synopsis-report/synopsis-report';
import * as routes from '../lib/routes';

export const setPointTracker = pointTracker => ({
  type: 'POINT_TRACKER_SET',
  payload: pointTracker,
});

export const setPointTrackers = pointTrackers => ({
  type: 'POINT_TRACKERS_SET',
  payload: pointTrackers,
});

export const setSynopsisReportLink = link => ({
  type: 'SYNOPSIS_REPORT_LINK_SET',
  payload: link,
});

export const clearSynopsisReportLink = () => ({
  type: 'SYNOPSIS_REPORT_LINK_CLEAR',
});

export const createPointTracker = pointTracker => (store) => {
  const { token } = store.getState();

  console.log('createPointTracker sending report', pointTracker.title);
  
  return superagent.post(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(pointTracker)
    .then((res) => {
      return store.dispatch(setPointTracker(res.body));
    })
    .catch((err) => {
      console.error('createPointTracker error:', err);
    });
};

export const fetchPointTrackers = studentIds => (store) => { // eslint-disable-line
  const { token } = store.getState();

  return superagent.get(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .then((res) => {
      const pointTrackers = res.body;
      return store.dispatch(setPointTrackers(pointTrackers));
    });
};
  
const pointTrackerToHTML = (pointTracker, student) => {
  const synopsisReport = <SynopsisReport pointTracker={pointTracker} student={student}/>;

  return (
    `<style>
    img { 
      width: 200px; 
    }
    .image {
      padding-left: 20px;
      padding-top: 10px;
      padding-bottom: 12px;
      height: 20px;
      background: #1f1f1f;
      width: 500px;
      border-radius: 30px;
    }
    body {
      padding: 20px;
      margin: '0px;
      border-radius: 30px;
      border: 2px solid #e8e8e8;      
    }
    h1, h2, h3 {
      font-style: bold;
      font-family: "Raleway", Helvetica;
      color: '089444;
    }
    p {
      font-family: "Raleway", Helvetica;
      color: #1186B4;
    }
    </style>
    ${ReactDOMServer.renderToString(synopsisReport)}
  `);
};

export const createSynopsisReport = pointTracker => (store) => {
  const { token } = store.getState();
  const student = store.getState().students.find(s => s._id.toString() === pointTracker.student.toString());

  const data = {
    name: pointTracker.studentName,
    html: pointTrackerToHTML(pointTracker, student),
  };

  return superagent.post(`${API_URL}${routes.SYNOPSIS_REPORT}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(data)
    .then((res) => {
      return store.dispatch(setSynopsisReportLink(res.body.webViewLink));
    });
};
