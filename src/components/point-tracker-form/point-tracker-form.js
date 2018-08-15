import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convertDateToValue } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import * as pointTrackerActions from '../../actions/point-tracker';

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

const mapDispatchToProps = dispatch => ({
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
  fetchStudents: studentIds => dispatch(pointTrackerActions.fetchStudents(studentIds)),
});

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      pointTracker: defaultState,
    };
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.createPointTracker(this.state.pointTracker);
  }

  componentDidMount() {
    this.props.fetchStudents()
      .then((students) => {
        this.setState({ students });
      })
      .catch(console.error);
  }

  render() {
    return (
      <React.Fragment>
        <h4>Point Sheet and Grades</h4>
        <form className="data-entry" onSubmit={ this.handleSubmit }>
          <label htmlFor="">Select Student</label>
          <select>
            { this.state.students.map((student) => {
              const { _id, firstName, lastName } = student;
              return (
                <option 
                  key={ _id } 
                  value={ _id }
                >{ `${firstName} ${lastName}`}
                </option>
              );
            })}
          </select>
          <label htmlFor="">Select Date</label>
          <input
            name="date"
            type="date"
            onChange={ this.handleChange }
            value={ convertDateToValue(this.state.pointTracker.date) }
          />
          <fieldset>
            <label htmlFor="attendedCheckin">Attended Check-In</label>
            <input
              type="checkbox"
              name="attendedCheckin"
              onChange= { this.handleChange }
              checked={ this.state.pointTracker.surveyQuestions.attendedCheckin }
            />

            <label htmlFor="metFaceToFace">Met Face-to-Face</label>
            <input
              type="checkbox"
              name="metFaceToFace"
              onChange= { this.handleChange }
              checked={ this.state.pointTracker.surveyQuestions.metFaceToFace }
            />

            <label htmlFor="hadOtherCommunication">Had Other Communication</label>
            <input
              type="checkbox"
              name="hadOtherCommunication"
              onChange= { this.handleChange }
              checked={ this.state.pointTracker.surveyQuestions.hadOtherCommunication }
            />

            <label htmlFor="scoreSheetTurnedIn">Score Sheet Turned In</label>
            <input
              type="checkbox"
              name="scoreSheetTurnedIn"
              onChange= { this.handleChange }
              checked={ this.state.pointTracker.surveyQuestions.scoreSheetTurnedIn }
            />
          </fieldset>
          <fieldset>
            <legend>Point Sheet and Grades</legend>
            <PointTrackerTable
              handleChange={ this.handleChange }
              subjects={ this.state.pointTracker.subjects }
            />
          </fieldset>
          <fieldset>
            <legend>Synopsis</legend>

            <label htmlFor="extraPlayingTime">Extra Playing Time</label>
            <textarea
              name="extraPlayingTime"
              onChange={ this.handleChange }
              value={ this.state.pointTracker.synopsisComments.extraPlayingTime }
            />

            <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
            <select
              name="mentorGrantedPlayingTime"
              onChange={ this.handleChange }
              value={ this.state.pointTracker.synopsisComments.mentorGrantedPlayingTime }
              >
              <option value="" disabled defaultValue>Select Playing Time</option>
              <option value="Entire Game">Entire Game</option>
              <option value="All but start">All but start</option>
              <option value="Three quarters">Three quarters</option>
              <option value="Two quarters">Two quarters</option>
              <option value="One quarter">One quarter</option>
              <option value="None of game">None of game</option>
            </select>

            <label htmlFor="studentActionItems">Student Action Items</label>
            <textarea
              name="studentActionItems"
              onChange={ this.handleChange }
              value={ this.state.pointTracker.synopsisComments.studentActionItems }
            />

            <label htmlFor="sportsUpdate">Sports Update</label>
            <textarea
              name="sportsUpdate"
              onChange={ this.handleChange }
              value={ this.state.pointTracker.synopsisComments.sportsUpdate }
              />

            <label htmlFor="additionalComments">Additional Comments</label>
            <textarea
              name="additionalComments"
              onChange={ this.handleChange }
              value={ this.state.pointTracker.synopsisComments.additionalComments }
            />
          </fieldset>
          <button type="submit">Submit Point Tracker</button>
        </form>
      </React.Fragment>
    );
  }
}

PointTrackerForm.propTypes = {
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  fetchStudents: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(PointTrackerForm);
