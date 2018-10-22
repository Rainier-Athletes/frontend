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

  const studentId = pointTracker.student._id.toString();

  return superagent.post(`${API_URL}${routes.POINTS_TRACKER_ROUTE}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({ ...pointTracker, student: studentId }) // this to prevent circular JSON
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

  // this css styles the html created in components/synopsis-report
  return (
    `<style>
    img {
      width: 200px;
    }
    .image {
      height: 20px;
      background: #1f1f1f;
      width: 100%;
      padding: 10px 20px 15px 10px;
      margin-bottom: 24px;
    }
    body {
      font-family: "Raleway", Helvetica;
      color: #000;
      padding: 20px;
      margin: 0px;
      font-size: 11px;
      line-height: 18px;
      font-weight: 300;
    }
    h3 {
      text-transform: uppercase;
      color: #A9A9A9;
      font-weight: 700;
      font-size: 10px;
      margin-top: 24px;
    }
    table {
      font-family: "Raleway", Helvetica;
      border-collapse: collapse;
      font-size: 11px;
      line-height: 20px;
      font-weight: 300;

      table-layout: auto;
      width: 100%;
    }
    th {
      border-bottom: 2px solid #ddd;
      table-layout: auto;
      text-align: left;
      font-weight: 400;
    }
    td {
      table-layout: auto;
      text-align: left;
    }
    table {
      margin-left: auto;
      margin-right: auto;
    }
    .row {
      display: block;
      width: 100%;
      height: 80px;
    }
    .left {
      float: left;
    }
    .right {
      float: left;
      margin-left: 130px;
    }

    </style>
    ${ReactDOMServer.renderToString(synopsisReport)}
  `);
};

export const createSynopsisReport = pointTracker => (store) => {
  const { token } = store.getState();
  const { student, studentName, title } = pointTracker;

  const data = {
    name: studentName,
    title,
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
