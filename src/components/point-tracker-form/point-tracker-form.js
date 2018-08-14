import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PointTrackerTable from '../point-tracker-table/point-tracker-table';

const defaultState = {
  _id: '1EF12348902093DECBA908', 
  date: 1533761272724,
  studentId: '1EF12348902093DECBA908',
  subjects: [{
    subjectName: 'Social Studies',
    teacher: '1EF12348902093DECBA910',
    scoring: {
      excusedDays: 1,
      stamps: 14,
      x: 3,
      tutorials: 1,
    },
  }, {
    subjectName: 'Math',
    teacher: '1EF12348902093DECBA912',
    scoring: {
      excusedDays: 1,
      stamps: 12,
      x: 6,
      tutorials: 0,
    },
  }, {
    subjectName: 'Biology',
    teacher: '1EF12348902093DECBA914',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      x: 1,
      tutorials: 2,
    },
  }],
  surveyQuestions: {
    attendedCheckin: true,
    metFaceToFace: true,
    hadOtherCommunication: false,
    scoreSheetTurnedIn: true,
  },
  synopsisComments: {
    extraPlayingTime: 'Jamie is working hard toward his goals. We agreed that if he achieved a small improvement this week he would get extra playing time.',
    mentorGrantedPlayingTime: 'Three Quarters',
    studentActionItems: 'Jamie agreed to attend 1 more tutorial in each of his classes this coming week',
    sportsUpdate: 'Last week Jamie had a great game against the Cardinals. Had two hits and caught three fly balls!',
    additionalComments: '',
  },
};

export default class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  handleChange = (event) => {
    const { name, value, checked } = event.target;
    
    const rootNames = ['_id', 'date', 'studentId'];
    const synopsisCommentsNames = Object.keys(this.state.synopsisComments);
    const surveyQuestionNames = Object.keys(this.state.surveyQuestions);

    if (rootNames.includes(name)) {
      this.setState({ [name]: value });
    }

    if (synopsisCommentsNames.includes(name)) {
      this.setState((prevState) => {
        const newSynopsisComments = { 
          ...prevState.synopsisComments,
          [name]: value,
        };

        return { synopsisComments: newSynopsisComments };
      });
    }

    if (surveyQuestionNames.includes(name)) {
      this.setState((prevState) => {
        const newSurveyQuestions = {
          ...prevState.surveyQuestions,
          [name]: checked,
        };

        return { surveyQuestions: newSurveyQuestions };
      });
    }

    this.setState((prevState) => {
      let newSubjects = [...prevState.subjects];
      const [subjectName, categoryName] = name.split('-');

      newSubjects = newSubjects.map((subject) => {
        if (subject.subjectName === subjectName) {
          const newSubject = { ...subject };
          newSubject.scoring[categoryName] = value;
          return newSubject;
        }

        return subject;
      });

      return { subjects: newSubjects };
    });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Hello from mentor landing</h1>
        <form className="selection-menu">
          <label htmlFor="">Select Student</label>
          <select>
            <option value="1">example student 1</option>
            <option value="2">example student 2</option>
          </select>
          <label htmlFor="">Select Date</label>
          <input name="date" type="date" onChange={ this.handleChange }/>
          <button type="submit">Create New Report</button>
        </form>
        <form className="data-entry">
          <fieldset>
            <label htmlFor="attendedCheckin">Attended Check-In</label>
            <input type="checkbox" name="attendedCheckin" onChange= { this.handleChange }/>

            <label htmlFor="metFaceToFace">Met Face-to-Face</label>
            <input type="checkbox" name="metFaceToFace" onChange= { this.handleChange }/>

            <label htmlFor="hadOtherCommunication">Had Other Communication</label>
            <input type="checkbox" name="hadOtherCommunication" onChange= { this.handleChange }/>

            <label htmlFor="scoreSheetTurnedIn">Score Sheet Turned In</label>
            <input type="checkbox" name="scoreSheetTurnedIn" onChange= { this.handleChange }/>
          </fieldset>
          <fieldset>
            <legend>Point Sheet and Grades</legend>
            <PointTrackerTable handleChange={ this.handleChange } subjects={ this.state.subjects }/>
          </fieldset>
          <fieldset>
            <legend>Synopsis</legend>

            <label htmlFor="extraPlayingTime">Extra Playing Time</label>
            <textarea name="extraPlayingTime" onChange={ this.handleChange }/>

            <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
            <select name="mentorGrantedPlayingTime" onChange={ this.handleChange }>
              <option value="" disabled defaultValue>Select Playing Time</option>
              <option value="Entire Game">Entire Game</option>
              <option value="All but start">All but start</option>
              <option value="Three quarters">Three quarters</option>
              <option value="Two quarters">Two quarters</option>
              <option value="One quarter">One quarter</option>
              <option value="None of game">None of game</option>
            </select>

            <label htmlFor="studentActionItems">Student Action Items</label>
            <textarea name="studentActionItems" onChange={ this.handleChange } />

            <label htmlFor="sportsUpdate">Sports Update</label>
            <textarea name="sportsUpdate" onChange={ this.handleChange } />

            <label htmlFor="additionalComments">Additional Comments</label>
            <textarea name="additionalComments" onChange={ this.handleChange }/>
            
          </fieldset>
          <button type="submit">Preview</button>
        </form>
      </React.Fragment>
    );
  }
}
