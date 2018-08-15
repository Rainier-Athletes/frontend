import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convertDateToValue } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import * as pointTrackerActions from '../../actions/point-tracker';
import './point-tracker-form.scss';

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
  fetchLastPointTracker: studentId => dispatch(pointTrackerActions.fetchLastPointTracker(studentId)),
});

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      pointTracker: defaultState,
    };
  }

  // YOU ARE HERE
  handleDateChange = (event) => {
    const { value } = event.target;
    const [year, month, day] = value.split('-'); // 2018-08-15 VALUE
    const date = new Date(
      parseInt(year, 10), 
      parseInt(month, 10) - 1, 
      parseInt(day, 10),
    );


    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.date = date.getTime();
      return newState;
    });
  }

  handleSubjectChange = (event) => {
    const { name, value } = event.target;
    
    this.setState((prevState) => {
      const newState = { ...prevState };
      const [subjectName, categoryName] = name.split('-');
      
      const newSubjects = newState.pointTracker.subjects
        .map((subject) => {
          if (subject.subjectName === subjectName) {
            const newSubject = { ...subject };
            newSubject.scoring[categoryName] = value;
            return newSubject;
          }

          return subject;
        });

      newState.pointTracker.subjects = newSubjects;
      return newState;
    });
  }

  handleSurveyQuestionChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.surveyQuestions[name] = checked;
      return newState;
    });
  }

  handleSynopsisCommentChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.synopsisComments[name] = value;
      return newState;
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.createPointTracker(this.state.pointTracker);
  }

  componentDidMount() {
    this.props.fetchStudents()
      .then((students) => {
        this.setState({ students });
      })
      .catch(console.error); // eslint-disable-line
  }

  // TODO: fix this event handler
  handleStudentSelect = (event) => {
    event.preventDefault();
    const studentId = event.target.value;

    this.props.fetchLastPointTracker(studentId)
      .then((response) => {
        console.log(response, 'RESPONSE'); // eslint-disable-line
      });

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.studentId = studentId;

      return newState;
    });
  }

  render() {
    const selectOptionsJSX = (
      <section>
        <div className="select-student">
        <label htmlFor="">Select Student</label>
          <select onChange={ this.handleStudentSelect } >
          { this.state.students.map((student) => {
            const { _id, firstName, lastName } = student;
            return (
              <option 
                placeholder="Select" 
                key={ _id } 
                value={ _id }
              >{ `${firstName} ${lastName}`}
              </option>
            );
          })}
          </select>
        </div>
      <div className="select-date">
        <label htmlFor="">Select Date</label>
        <input
          name="date"
          type="date"
          onChange={ this.handleDateChange }
          value={ convertDateToValue(this.state.pointTracker.date) }
          />
        </div>
      </section>
    );
    
    const surveyQuestionsJSX = (
      <div className="survey-questions">
      <label htmlFor="attendedCheckin">Attended Check-In</label>
      <input
        type="checkbox"
        name="attendedCheckin"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.attendedCheckin }
      />

      <label htmlFor="metFaceToFace">Met Face-to-Face</label>
      <input
        type="checkbox"
        name="metFaceToFace"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.metFaceToFace }
      />

      <label htmlFor="hadOtherCommunication">Had Other Communication</label>
      <input
        type="checkbox"
        name="hadOtherCommunication"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.hadOtherCommunication }
      />

      <label htmlFor="scoreSheetTurnedIn">Score Sheet Turned In</label>
      <input
        type="checkbox"
        name="scoreSheetTurnedIn"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.scoreSheetTurnedIn }
      />
    </div>
    );
    
    const synopsisCommentsJSX = (
      <div className="synopsis">
      <h4>Synopsis</h4>

      <label htmlFor="extraPlayingTime">Extra Playing Time</label>
      <textarea
        name="extraPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.extraPlayingTime }
      />

      <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
      <select
        name="mentorGrantedPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
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
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.studentActionItems }
      />

      <label htmlFor="sportsUpdate">Sports Update</label>
      <textarea
        name="sportsUpdate"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.sportsUpdate }
        />

      <label htmlFor="additionalComments">Additional Comments</label>
      <textarea
        name="additionalComments"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.additionalComments }
      />
    </div>
    );

    return (
      <div className="points-tracker">
        <React.Fragment>
          <form className="data-entry" onSubmit={ this.handleSubmit }>
            <h1>POINT TRACKER TABLE</h1>
              <h4>Point Sheet and Grades</h4>
              { selectOptionsJSX }
              { surveyQuestionsJSX }
                <PointTrackerTable
                  handleChange={ this.handleChange }
                  subjects={ this.state.pointTracker.subjects }
              />
              { synopsisCommentsJSX }
            <button type="submit">Submit Point Tracker</button>
          </form>
        </React.Fragment>
      </div>
    );
  }
}

PointTrackerForm.propTypes = {
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  fetchStudents: PropTypes.func,
  fetchLastPointTracker: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(PointTrackerForm);
