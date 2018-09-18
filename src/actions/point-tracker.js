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

export const createPointTracker = pointTracker => (store) => {
  const { token } = store.getState();

  // pointTracker.date = new Date(pointTracker.date).toISOString();
  pointTracker.title = `Point Tracker for ${pointTracker.date}`;

  console.log('createPointTracker sending', JSON.stringify(pointTracker, null, 4));
  
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
  
const pointTrackerToHTML = (pointTracker) => {
  const synopsisReport = <SynopsisReport pointTracker={pointTracker}/>;

  return (
    `<style>

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
      }

      p {
        font-family: Arial;
        color:#1186B4;
      }

    </style>
    ${ReactDOMServer.renderToString(synopsisReport)}
  `);
};

export const createSynopsisReport = pointTracker => (store) => {
  const { token } = store.getState();

  const data = {
    name: pointTracker.studentName,
    html: pointTrackerToHTML(pointTracker),
  };

  return superagent.post(`${API_URL}${routes.SYNOPSIS_REPORT}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(data)
    .then((res) => {
      return store.dispatch(setPointTracker(res.body));
    });
};
