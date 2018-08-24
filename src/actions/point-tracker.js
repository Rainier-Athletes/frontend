import superagent from 'superagent';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SynopsisReport from '../components/synopsis-report/synopsis-report';
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
  
const pointTrackerToHTML = (pointTracker) => {
  const synopsisReport = <SynopsisReport pointTracker={pointTracker}/>;
  console.log(ReactDOMServer.renderToString(synopsisReport), 'RENDERED SYNOPSIS REPORT');
  return (ReactDOMServer.renderToString(synopsisReport));
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
