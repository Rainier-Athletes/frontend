import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReportingPeriods } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import PointTrackerSummary from '../point-tracker-summary/point-tracker-summary';
import * as pointTrackerActions from '../../actions/point-tracker';
import waitingGif from '../../assets/loading_icon_2.gif';

import './point-tracker-form.scss';

const emptyPointTracker = {
  date: new Date(Date.now()).toDateString(),
  title: '',
  student: '',
  studentName: '',
  subjects: [{
    subjectName: 'Tutorial',
    scoring: {
      excusedDays: 0,
      stamps: 0,
      halfStamps: 0,
    },
    grade: '',
  }],
  communications: [
    {
      with: 'Student',
      role: 'student',
      f2fCheckIn: false,
      f2fRaEvent: false,
      f2fGameOrPractice: false,
      basecampOrEmail: false,
      phoneOrText: false,
      familyMeeting: false,
      notes: '',
    },
    {
      with: 'Family',
      role: 'family',
      f2fCheckIn: false,
      f2fRaEvent: false,
      f2fGameOrPractice: false,
      basecampOrEmail: false,
      phoneOrText: false,
      familyMeeting: false,
      notes: '',
    },
    {
      with: 'Teacher',
      role: 'teacher',
      f2fCheckIn: false,
      f2fRaEvent: false,
      f2fGameOrPractice: false,
      basecampOrEmail: false,
      phoneOrText: false,
      familyMeeting: false,
      notes: '',
    },
    {
      with: 'Coach',
      role: 'coach',
      f2fCheckIn: false,
      f2fRaEvent: false,
      f2fGameOrPractice: false,
      basecampOrEmail: false,
      phoneOrText: false,
      familyMeeting: false,
      notes: '',
    },
  ],
  oneTeam: {
    mentorMeal: false,
    sportsGame: false,
    communityEvent: false,
    iepSummerReview: false,
    other: false,
  },
  oneTeamNotes: '',
  pointSheetStatus: {
    turnedIn: true,
    lost: false,
    incomplete: false,
    absent: false,
  },
  pointSheetStatusNotes: '',
  earnedPlayingTime: '',
  mentorGrantedPlayingTime: '',
  synopsisComments: {
    mentorGrantedPlayingTimeComments: '',
    studentActionItems: '',
    sportsUpdate: '',
    additionalComments: '',
  },
};

const names = {
  turnedIn: 'Point sheet turned in',
  lost: 'Point sheet lost',
  incomplete: 'Point sheet less than 25% completed',
  absent: 'Student reported absent',
  other: 'Other',
  mentorGrantedPlayingTimeComments: 'Mentor Granted Playing Time Explanation',
  studentActionItems: 'Student Action Items',
  sportsUpdate: 'Sports Update',
  additionalComments: 'Additional Comments',
  mentorMeal: 'Mentor meal',
  sportsGame: 'Sports game meet up',
  communityEvent: 'RA Comm. Event meet up',
  iepSummerReview: 'IEP/Summer Review Meeting',
};

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = emptyPointTracker;

    this.state.synopsisSaved = false;
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.synopsisReportLink !== prevProps.synopsisReportLink) {
      this.setState({
        ...this.state,
        synopsisSaved: true,
        waitingOnSaves: false,
        synopsisLink: this.props.synopsisReportLink,
      });
    }
  }

  componentDidMount = () => {
    const selectedStudent = this.props.content;
    const { lastPointTracker } = selectedStudent.studentData;

    this.setState((prevState) => {
      let newState = { ...prevState };
      newState = lastPointTracker || emptyPointTracker;
      newState.student = `${selectedStudent._id}`;
      newState.studentName = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
      newState.title = `${newState.studentName} ${getReportingPeriods()[1]}`;
      newState.synopsisSaved = false;
      return newState;
    });
  }

  handleTitleChange = (event) => {
    const newState = { ...this.state, synopsisSaved: false };
    newState.title = `${newState.studentName} ${event.target.value}`;
    this.setState(newState);
  }

  handleSubjectChange = (event) => {
    event.persist();

    const validGrades = ['A', 'B', 'C', 'D', 'F', ''];

    const { name } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      const [subjectName, categoryName] = name.split('-');

      const newSubjects = newState.subjects
        .map((subject) => {
          if (subject.subjectName === subjectName) {
            const newSubject = { ...subject };
            if (categoryName === 'grade') {
              newSubject.grade = validGrades.includes(event.target.value.toUpperCase()) ? event.target.value.toUpperCase() : '';
            } else if (categoryName === 'excusedDays') {
              newSubject.scoring.excusedDays = Math.min(Math.max(parseInt(event.target.value, 10), 0), 5);
            } else {
              const currentValue = parseInt(event.target.value, 10);
              // test currentValue for NaN which doesn't equal itself.
              if (currentValue !== currentValue) { // eslint-disable-line
                newSubject.scoring[categoryName] = '';
              } else {
                const maxPointsPossible = 40 - (newSubject.scoring.excusedDays * 8);
                const maxPointsAdjustment = categoryName === 'stamps'
                  ? newSubject.scoring.halfStamps
                  : newSubject.scoring.stamps * 2;
                let maxValidValue = maxPointsPossible - maxPointsAdjustment;
                maxValidValue = categoryName === 'stamps' ? maxValidValue / 2 : maxValidValue;
                newSubject.scoring[categoryName] = Math.floor(Math.min(Math.max(currentValue, 0), maxValidValue));
              }
            }

            return newSubject;
          }
          return subject;
        });

      newState.subjects = newSubjects;
      return newState;
    });
  }

  handlePointSheetTurnedInChange = (event) => {
    const newState = Object.assign({}, this.state);
    newState.pointSheetStatus.turnedIn = event.target.value === 'true';
    if (!newState.pointSheetStatus.turnedIn) {
      const keys = Object.keys(newState.pointSheetStatus);
      keys.forEach((key) => {
        newState.pointSheetStatus[key] = false;
      });
    }
    this.setState(newState);
  }

  handlePointSheetStatusChange = (event) => {
    const { id } = event.target;
    this.setState((prevState) => {
      const newState = { ...prevState };
      const keys = Object.keys(newState.pointSheetStatus);
      keys.forEach((key) => {
        newState.pointSheetStatus[key] = false;
        if (key === id) newState.pointSheetStatus[key] = true;
      });
      return newState;
    });
  }

  handlePointSheetNotesChange = (event) => {
    this.setState({ pointSheetStatusNotes: event.target.value });
  }

  handleOneTeamChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.oneTeam[name] = checked;
      return newState;
    });
  }

  handleOneTeamNotesChange = (event) => {
    this.setState({ oneTeamNotes: event.target.value });
  }

  handlePlayingTimeChange = (event) => {
    this.setState({ ...this.state, mentorGrantedPlayingTime: event.target.value });
  }

  handleSynopsisCommentChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.synopsisComments[name] = value;
      return newState;
    });
  }

  validScores = (subjects) => {
    return subjects.every(subject => (
      subject.scoring.stamps * 2 + subject.scoring.halfStamps <= 40 - subject.scoring.excusedDays * 8
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const pointTracker = this.state;
    if (this.validScores(pointTracker.subjects)) {
      delete pointTracker._id;
      console.log('handleSubmit', pointTracker.title);
      this.setState({ ...this.state, waitingOnSaves: true });
      this.props.createPointTracker(pointTracker);
      this.props.createSynopsisReport(pointTracker);

      this.setState({ pointTracker: emptyPointTracker });
    } else {
      console.log('scores not valid for submitting point tracker');
      alert('Errors in scores. Please correct before saving.');
    }
  }

  deleteSubject = (subjectName, teacherId) => {
    this.setState((prevState) => {
      const newState = { ...prevState };

      newState.subjects = newState.subjects.filter((subject) => {
        if (subjectName && teacherId) {
          return subject.subjectName !== subjectName && subject.teacher !== teacherId;
        }
        return subject.subjectName !== subjectName;
      });

      return newState;
    });
  }

  createSubject = (subjectName, teacherId) => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      const newSubject = {
        subjectName,
        teacher: teacherId,
        scoring: {
          excusedDays: '',
          stamps: '',
          halfStamps: '',
        },
        grade: '',
      };

      newState.subjects.push(newSubject);

      return newState;
    });
  }

  calcPlayingTime = () => {
    if (!this.state.student) return null;

    console.groupCollapsed('calcPlayingTime');
    const { subjects } = this.state;
    const studentsFiltered = this.props.students.filter(s => s._id.toString() === this.state.student.toString());
    const student = studentsFiltered[0];

    let isElementarySchool = null;
    if (student.studentData.school.length > 0) {
      isElementarySchool = student.studentData.school.filter(s => s.currentSchool)[0].isElementarySchool; // eslint-disable-line
    }

    const numberOfPeriods = subjects.length;
    const totalClassTokens = numberOfPeriods * 2;
    const totalTutorialTokens = isElementarySchool ? 0 : 4;
    const totalGradeTokens = isElementarySchool ? 0 : numberOfPeriods;
    const totalTokensPossible = totalClassTokens + totalGradeTokens + totalTutorialTokens;
    console.log('token data:', totalClassTokens, totalTutorialTokens, totalGradeTokens, totalTokensPossible);

    const totalEarnedTokens = subjects.map((subject) => {
      const { grade, subjectName } = subject;
      // halfStamps are "X"s from the scoring sheet
      const { excusedDays, stamps, halfStamps } = subject.scoring;
      console.log('form data:', isElementarySchool, subjectName, excusedDays, stamps, halfStamps, grade);

      let pointsPossible = 40 - (excusedDays * 8);
      if (isElementarySchool && subjectName.toLowerCase() === 'tutorial') pointsPossible = 0;
      if (subjectName.toLowerCase() === 'tutorial') pointsPossible = 8 - (excusedDays * 2);
      console.log('pointsPossible', pointsPossible);

      const totalClassPointsEarned = (2 * stamps) + halfStamps;
      const classPointPercentage = totalClassPointsEarned / pointsPossible;
      console.log('totalClassPointsEarned', totalClassPointsEarned, 'classPointPercentage', classPointPercentage);

      let classTokensEarned = 0;
      if (classPointPercentage >= 0.50) classTokensEarned = 1;
      if (classPointPercentage >= 0.75) classTokensEarned = 2;

      let gradeTokensEarned = 0;
      if (!isElementarySchool && ['A', 'B'].includes(grade)) gradeTokensEarned = 2;
      if (!isElementarySchool && grade === 'C') gradeTokensEarned = 1;

      const totalTokensEarned = classTokensEarned + gradeTokensEarned;
      console.log('classTokens', classTokensEarned, 'gradeTokens', gradeTokensEarned, 'totalTokens', totalTokensEarned);
      console.log('.map w/in calc playing time:', subject.scoring);
      return totalTokensEarned;
    });

    const totalTokensEarned = totalEarnedTokens.reduce((acc, cur) => acc + cur, 0);
    const tokenPercentage = totalTokensEarned / totalTokensPossible;
    console.log('totalTokensEarned', totalTokensEarned, 'tokenPercentage', tokenPercentage);

    let earnedPlayingTime = 'None of game';
    if (tokenPercentage >= 0.35) earnedPlayingTime = 'One quarter';
    if (tokenPercentage >= 0.55) earnedPlayingTime = 'Two quarters';
    if (tokenPercentage >= 0.65) earnedPlayingTime = 'Three quarters';
    if (tokenPercentage >= 0.75) earnedPlayingTime = 'All but start';
    if (tokenPercentage >= 0.8) earnedPlayingTime = 'Entire game';
    if (earnedPlayingTime !== this.state.earnedPlayingTime) {
      this.setState({
        ...this.state,
        earnedPlayingTime,
      });
    }
    console.log('earnedPlayingTime', earnedPlayingTime);
    console.groupEnd('calcPlayingTime');
    return earnedPlayingTime;
  }

  render() {
    const reportingPeriods = getReportingPeriods();

    const selectOptionsJSX = (
      <div className="row">
        <div className="col-md-6">
          <span className="title">Student</span>
          <span className="name">{this.props.content.firstName} {this.props.content.lastName }</span>
        </div>
        <div className="col-md-6">
          <label className="title" htmlFor="">Select Reporting Period</label>
          <select
            required
            onChange={ this.handleTitleChange }
            defaultValue={reportingPeriods[1]}>
            {reportingPeriods.map(p => (
              <option
                key={p}
                value={p}>
              {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    );

    const oneTeamJSX = (
      <fieldset>
        <span className="title">One Team Face-to-Face Meet Ups</span>
        <div className="survey-questions">
        {Object.keys(this.state.oneTeam)
          .filter(keyName => names[keyName])
          .map((oneTeamQuestion, i) => (
            <div className="survey-question-container" key={ i }>
              <input
                type="checkbox"
                name={ oneTeamQuestion }
                onChange= { this.handleOneTeamChange }
                checked={ this.state.oneTeam.oneTeamQuestion }/>
              <label htmlFor={ oneTeamQuestion }>{ names[oneTeamQuestion] }</label>
            </div>
          ))}
          <div className="survey-question-container">
            <label className="title" htmlFor="oneTeamNotes">One Team Notes</label>
                    <textarea
                      name="One Team Notes"
                      onChange={ this.handleOneTeamNotesChange }
                      value={ this.state.oneTeamNotes }
                      rows="2"
                      cols="80"
                      wrap="hard"
                    />
          </div>
        </div>
    </fieldset>
    );

    const pointSheetStatusJSX = (
      <fieldset>
        <span className="title">Point Sheet Status</span>
        <div className="survey-questions">
          {Object.keys(this.state.pointSheetStatus)
            .filter(keyName => names[keyName])
            .map((statusQuestion, i) => {
              if (statusQuestion === 'turnedIn') {
                return (
                  <div className="survey-question-container" key={ i }>
                    <label htmlFor="turned-in">Point sheet turned in: </label>
                      <input 
                        type="radio" 
                        name="turned-in" 
                        value="true" 
                        checked={this.state.pointSheetStatus.turnedIn ? 'checked' : ''} 
                        onChange={this.handlePointSheetTurnedInChange}/> Yes
                      <input 
                        type="radio" 
                        name="turned-in" 
                        value="false" 
                        checked={!this.state.pointSheetStatus.turnedIn ? 'checked' : ''} 
                        onChange={this.handlePointSheetTurnedInChange}/> No
                    {/* </label> */}
                  </div>
                );
              }
              console.log('other:', this.state.pointSheetStatus.other);
              return (!this.state.pointSheetStatus.turnedIn
                ? <div className="survey-question-container" key={ i }>
                  <input
                    type="radio"
                    id={ statusQuestion }
                    name="pointSheetStatus"
                    required={!this.state.pointSheetStatus.turnedIn}
                    onChange= { this.handlePointSheetStatusChange }
                    checked={ this.state.pointSheetStatus.statusQuestion }/>{ names[statusQuestion] }
                  {/* <label htmlFor={ statusQuestion }>{ names[statusQuestion] }</label> */}
                </div>
                : null
              );
            })
            }
            { !this.state.pointSheetStatus.turnedIn 
              ? <div className="survey-question-container">
                <label className="title" htmlFor="pointSheetStatusNotes">Point Sheet Status Notes</label>
                        <textarea
                          name="pointSheetStatusNotes"
                          placeholder={this.state.pointSheetStatus.other ? 'Please explain selected status...' : ''}
                          onChange={ this.handlePointSheetNotesChange }
                          value={ this.state.pointSheetStatusNotes }
                          required={this.state.pointSheetStatus.other}
                          rows="2"
                          cols="80"
                          wrap="hard"
                        />
              </div>
              : '' }
        </div>
    </fieldset>
    );

    const communicationPillarsTableJSX = (
      <fieldset>
        <span className="title">Communication Touch Points</span>
        <div className="survey-questions">
          <h6>The Comm Table Goes Here</h6>
        </div>
      </fieldset>
    );

    // add back in calc plauing time calc below
    const playingTime = (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Playing Time Earned</span>
            <span className="name">{ this.calcPlayingTime() } </span>
          </div>
          <div className="col-md-6">
            <label className="title" htmlFor="mentorGrantedPlayingTime">Mentor Granted Playing Time:</label>
            <select
              name="mentorGrantedPlayingTime"
              onChange={ this.handlePlayingTimeChange }
              value={ this.state.mentorGrantedPlayingTime }
              required
              >
              <option value="" defaultValue>Select Playing Time</option>
              <option value="Entire game">Entire Game</option>
              <option value="All but start">All but start</option>
              <option value="Three quarters">Three quarters</option>
              <option value="Two quarters">Two quarters</option>
              <option value="One quarter">One quarter</option>
              <option value="None of game">None of game</option>
            </select>
          </div>
        </div>
      </React.Fragment>
    );

    const synopsisCommentsJSX = (
      <div className="synopsis">
        {
          Object.keys(this.state.synopsisComments)
            .filter(keyName => names[keyName])
            .map((synopsisComment, i) => {
              if (synopsisComment === 'mentorGrantedPlayingTimeComments') {
                if (this.state.mentorGrantedPlayingTime === '' // '' => none selected
                  || this.state.mentorGrantedPlayingTime === this.state.earnedPlayingTime) {
                  return null;
                }
              }
              return (
                <div key={ i }>
                  <label className="title" htmlFor={ synopsisComment }>{ names[synopsisComment] }</label>
                  <textarea
                    name={ synopsisComment }
                    onChange={ this.handleSynopsisCommentChange }
                    value={ this.state.synopsisComments[synopsisComment] }
                    rows="6"
                    cols="80"
                    wrap="hard"
                  />
                </div>
              );
            })
        }
      </div>
    );

    return (
      <div className="points-tracker panel point-tracker-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title title">Point Tracker Table</h5>
              <button type="button" className="close" onClick={ this.props.buttonClick } data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="data-entry container" onSubmit={ this.handleSubmit }>
                { selectOptionsJSX }
                { communicationPillarsTableJSX }
                { oneTeamJSX }
                { pointSheetStatusJSX }
                { playingTime }
                <PointTrackerTable
                  handleSubjectChange={ this.handleSubjectChange }
                  subjects={ this.state.subjects }
                  teachers={ this.props.content.studentData.teachers }
                  deleteSubject= { this.deleteSubject }
                  createSubject={ this.createSubject }
                />
                { synopsisCommentsJSX }
                <div className="modal-footer">
                  { this.state.waitingOnSaves ? <img src={waitingGif} alt="waiting" /> : <button className="btn btn-secondary" type="submit">Submit Point Tracker</button> }
                  { this.state.synopsisSaved ? <PointTrackerSummary pointTracker={this.state}/> : null }
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  students: state.students,
  teachers: state.teachers,
  synopsisReportLink: state.synopsisReportLink,
});

const mapDispatchToProps = dispatch => ({
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
  createSynopsisReport: pointTracker => dispatch(pointTrackerActions.createSynopsisReport(pointTracker)),
  clearSynopsisReportLink: () => dispatch(pointTrackerActions.clearSynopsisReportLink()),
});

PointTrackerForm.propTypes = {
  students: PropTypes.array,
  teachers: PropTypes.array,
  synopsisReportLink: PropTypes.string,
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  createSynopsisReport: PropTypes.func,
  clearSynopsisReportLink: PropTypes.func,
  fetchStudents: PropTypes.func,
  fetchTeachers: PropTypes.func,
  buttonClick: PropTypes.func,
  content: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PointTrackerForm);
