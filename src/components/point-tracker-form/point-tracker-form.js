import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getReportingPeriods } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import PointTrackerSummary from '../point-tracker-summary/point-tracker-summary';
import TooltipItem from '../tooltip/tooltip';
import * as pointTrackerActions from '../../actions/point-tracker';

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
    wednesdayCheckin: false,
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
  turnedIn: 'Point Sheet (> 25% complete): ',
  lost: 'Point Sheet Lost',
  incomplete: 'Point Sheet (< 25% completed)',
  absent: 'Student Reported Absent',
  other: 'Other',
  mentorGrantedPlayingTimeComments: 'Mentor Granted Playing Time Explanation:',
  studentActionItems: 'Student Action Items:',
  sportsUpdate: 'Sports Update:',
  additionalComments: 'Additional Comments:',
  wednesdayCheckin: 'Wednesday Check-In',
  mentorMeal: 'Mentor Meal',
  sportsGame: 'Sports Game Meet-Up',
  communityEvent: 'RA Comm. Event Meet-Up',
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
      newState.student = selectedStudent;
      newState.studentName = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
      newState.isElementaryStudent = selectedStudent.studentData.school
        && selectedStudent.studentData.school.length
        ? selectedStudent.studentData.school.find(s => s.currentSchool).isElementarySchool
        : false;
      // elementary has no tutorial so pop it from the empty point tracker
      if (newState.isElementaryStudent && !lastPointTracker) newState.subjects.pop();
      newState.title = `${newState.studentName}: ${getReportingPeriods()[1]}`;
      newState.synopsisSaved = false;
      newState.mentorGrantedPlayingTime = '';
      newState.teachers = this.props.content.studentData.teachers;
      return newState;
    });
  }

  handleTitleChange = (event) => {
    const newState = { ...this.state, synopsisSaved: false };
    newState.title = `${newState.studentName}: ${event.target.value}`;
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
              if (subjectName.toLowerCase() === 'tutorial') newSubject.grade = '';
            } else if (categoryName === 'excusedDays') {
              newSubject.scoring.excusedDays = Math.min(Math.max(parseInt(event.target.value, 10), 0), 5);
            } else {
              const currentValue = parseInt(event.target.value, 10);
              // test currentValue for NaN which doesn't equal itself.
              if (currentValue !== currentValue) { // eslint-disable-line
                newSubject.scoring[categoryName] = '';
              } else {
                const maxStampsPossible = 20 - (newSubject.scoring.excusedDays * 4);
                const maxStampsAdjustment = categoryName === 'stamps'
                  ? newSubject.scoring.halfStamps
                  : newSubject.scoring.stamps;
                const maxValidStamps = maxStampsPossible - maxStampsAdjustment;
                newSubject.scoring[categoryName] = Math.floor(Math.min(Math.max(currentValue, 0), maxValidStamps));
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
      subject.scoring.stamps + subject.scoring.halfStamps <= 20 - subject.scoring.excusedDays * 4
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const pointTracker = this.state;
    if (this.validScores(pointTracker.subjects)) {
      delete pointTracker._id;

      this.setState({ ...this.state, waitingOnSaves: true });
      this.props.createPointTracker({ ...pointTracker });
      this.props.createSynopsisReport(pointTracker);

      this.setState({ pointTracker: emptyPointTracker });
    } else {
      alert('Errors in scores. Please correct before saving.'); // eslint-disable-line
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
        teacher: this.state.teachers.find(t => t.teacher._id.toString() === teacherId.toString()).teacher,
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

  saveSubjectTable = () => {
    const pointTracker = { ...this.state };
    delete pointTracker._id;
    this.props.createPointTracker({ ...pointTracker });
  }

  calcPlayingTime = () => {
    if (!this.state.student) return null;

    const { subjects } = this.state;
    const { student } = this.state;

    let isElementarySchool = null;
    if (student.studentData.school.length > 0) {
      isElementarySchool = student.studentData.school.filter(s => s.currentSchool)[0].isElementarySchool; // eslint-disable-line
    }

    const numberOfPeriods = subjects.length;
    const totalClassTokens = numberOfPeriods * 2;
    const totalTutorialTokens = isElementarySchool ? 0 : 4;
    const totalGradeTokens = isElementarySchool ? 0 : numberOfPeriods;
    const totalTokensPossible = totalClassTokens + totalGradeTokens + totalTutorialTokens;

    const totalEarnedTokens = subjects.map((subject) => {
      const { grade, subjectName } = subject;
      // halfStamps are "X"s from the scoring sheet
      const { excusedDays, stamps, halfStamps } = subject.scoring;

      let pointsPossible = 40 - (excusedDays * 8);
      if (subjectName.toLowerCase() === 'tutorial') pointsPossible = 8 - (excusedDays * 2);
      if (isElementarySchool && subjectName.toLowerCase() === 'tutorial') pointsPossible = 0;

      const totalClassPointsEarned = (2 * stamps) + halfStamps;
      const classPointPercentage = totalClassPointsEarned / pointsPossible;

      let classTokensEarned = 0;
      if (classPointPercentage >= 0.50) classTokensEarned = 1;
      if (classPointPercentage >= 0.75) classTokensEarned = 2;

      let gradeTokensEarned = 0;
      if (!isElementarySchool && ['A', 'B'].includes(grade)) gradeTokensEarned = 2;
      if (!isElementarySchool && grade === 'C') gradeTokensEarned = 1;

      const totalTokensEarned = classTokensEarned + gradeTokensEarned;

      return totalTokensEarned;
    });

    const totalTokensEarned = totalEarnedTokens.reduce((acc, cur) => acc + cur, 0);
    const tokenPercentage = totalTokensEarned / totalTokensPossible;

    let earnedPlayingTime = 'None of Game';
    if (tokenPercentage >= 0.35) earnedPlayingTime = 'One Quarter';
    if (tokenPercentage >= 0.55) earnedPlayingTime = 'Two Quarters';
    if (tokenPercentage >= 0.65) earnedPlayingTime = 'Three Quarters';
    if (tokenPercentage >= 0.75) earnedPlayingTime = 'All but Start';
    if (tokenPercentage >= 0.8) earnedPlayingTime = 'Entire Game';
    if (earnedPlayingTime !== this.state.earnedPlayingTime) {
      this.setState({
        ...this.state,
        earnedPlayingTime,
      });
    }

    return earnedPlayingTime;
  }

  handleCommCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const [role, row, columnKey] = name.split('-'); // eslint-disable-line

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.communications[row][columnKey] = checked;
      return newState;
    });
  }

  commCheckbox = (com, row, col) => {
    const columnKeys = [
      'faceToFace',
      'digital',
      'phone',
      'other',
    ];

    const checked = this.state.communications[row][columnKeys[col]] || false;

    return (
      <input
        type="checkbox"
        name={ `${com.role}-${row}-${columnKeys[col]}` }
        onChange= { this.handleCommCheckboxChange }
        checked={ checked }
        />
    );
  }

  handleCommNotesChange = (event) => {
    const { id, value } = event.target;
    const row = id.split('-')[1];

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.communications[row].notes = value;
      return newState;
    });
  }

  commNotes = (com, row) => {
    return (<textarea
      rows="2"
      wrap="hard"
      required={this.state.communications[row].other}
      placeholder={this.state.communications[row].other ? 'Please explain choice of Other' : ''}
      id={`${com.role}-${row}-notes`}
      value={this.state.communications[row].notes} onChange={this.handleCommNotesChange}/>
    );
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
        <div className="survey-questions">
        <span className="title">One Team Face-to-Face Meet-Ups</span>
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
            <span className="title" htmlFor="oneTeamNotes">One Team Notes</span>
                <textarea
                  name="One Team Notes"
                  onChange={ this.handleOneTeamNotesChange }
                  value={ this.state.oneTeamNotes }
                  placeholder={this.state.oneTeam.other ? 'Please explain selection of Other' : ''}
                  required={this.state.oneTeam.other}
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
        <div className="survey-questions">
        <span className="title">Point Sheet Status</span>
          {Object.keys(this.state.pointSheetStatus)
            .filter(keyName => names[keyName])
            .map((statusQuestion, i) => {
              if (statusQuestion === 'turnedIn') {
                return (
                  <div className="survey-question-container" key={ i }>
                    <label htmlFor="turned-in">{ names[statusQuestion] }</label>
                      <input
                        type="radio"
                        name="turned-in"
                        value="true"
                        className="inline"
                        checked={this.state.pointSheetStatus.turnedIn ? 'checked' : ''}
                        onChange={this.handlePointSheetTurnedInChange}/> Yes
                      <input
                        type="radio"
                        name="turned-in"
                        value="false"
                        className="inline"
                        checked={!this.state.pointSheetStatus.turnedIn ? 'checked' : ''}
                        onChange={this.handlePointSheetTurnedInChange}/> No
                    {/* </label> */}
                  </div>
                );
              }

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
                <span className="title" htmlFor="pointSheetStatusNotes">Point Sheet Status Notes</span>
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
          <table className="table">
            <thead>
              <tr>
                <th>RA Core Pillar</th>
                <th>
                  Face-To-Face
                  <TooltipItem id={'tooltip-corepillar'} text={'In person communication'}/>
                </th>
                <th>
                  Digital
                  <TooltipItem id={'tooltip-corepillar'} text={'Communication through basecamp, text msg, email, etc.'}/>
                </th>
                <th>
                  Phone Call
                  <TooltipItem id={'tooltip-corepillar'} text={'Digital communication through voice or video'}/>
                </th>
                <th>Other</th>
              </tr>
            </thead>
            <tbody>
              {this.state.communications.map((com, i) => (
                <React.Fragment key={`${com.role}${i}7`}>
                <tr key={`${com.role}${i}8`}>
                  <td key={`${com.role}${i}0`}>{com.with}</td>
                  <td key={`${com.role}${i}1`}>{this.commCheckbox(com, i, 0)}</td>
                  <td key={`${com.role}${i}2`}>{this.commCheckbox(com, i, 1)}</td>
                  <td key={`${com.role}${i}3`}>{this.commCheckbox(com, i, 2)}</td>
                  <td key={`${com.role}${i}4`}>{this.commCheckbox(com, i, 3)}</td>
                </tr>
                {com.other
                  ? <tr key={`${com.role}${i}5`}>
                    <td>Notes:</td>
                    <td colSpan="4" key={`${com.role}${i}6`}>{this.commNotes(com, i)}</td>
                  </tr>
                  : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </fieldset>
    );

    // add back in calc playing time calc below
    const playingTimeJSX = (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
            <span className="title">Game Eligibility Earned</span>
            <span className="name">{ this.calcPlayingTime() } </span>
          </div>
          <div className="col-md-6">
            <span className="title" htmlFor="mentorGrantedPlayingTime">Optional Mentor Granted Playing Time:</span>
            <select
              name="mentorGrantedPlayingTime"
              onChange={ this.handlePlayingTimeChange }
              value={ this.state.mentorGrantedPlayingTime }
              >
              <option value="" defaultValue>Select playing time override:</option>
              <option value="Entire game">Entire Game</option>
              <option value="All but start">All but Start</option>
              <option value="Three quarters">Three Quarters</option>
              <option value="Two quarters">Two Quarters</option>
              <option value="One quarter">One Quarter</option>
              <option value="None of game">None of Game</option>
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
              const playingTimeCommentsRequired = synopsisComment === 'mentorGrantedPlayingTimeComments'
                && (this.state.mentorGrantedPlayingTime !== '' // '' => none selected
              && this.state.mentorGrantedPlayingTime !== this.state.earnedPlayingTime);
              if (synopsisComment === 'mentorGrantedPlayingTimeComments') {
                if (!playingTimeCommentsRequired) {
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
                    required={playingTimeCommentsRequired}
                    placeholder={playingTimeCommentsRequired
                      ? 'Please explain your choice of student playing time.'
                      : ''}
                  />
                </div>
              );
            })
        }
      </div>
    );

    const pointTrackerForm = (
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
                <PointTrackerTable
                  handleSubjectChange={ this.handleSubjectChange }
                  subjects={ this.state.subjects }
                  teachers={ this.props.content.studentData.teachers }
                  deleteSubject= { this.deleteSubject }
                  createSubject={ this.createSubject }
                  isElementaryStudent={this.state.isElementaryStudent}
                  myRole={this.props.myRole}
                  saveSubjectTable={this.saveSubjectTable}
                />
                { playingTimeJSX }
                { synopsisCommentsJSX }
                <div className="modal-footer">
                  { this.state.waitingOnSaves ? <FontAwesomeIcon icon="spinner" className="fa-spin fa-2x"/> : <button className="btn btn-secondary" type="submit">Submit Point Tracker</button> }
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    );

    return (
      <div className="modal-backdrop">
        { this.state.synopsisSaved ? <PointTrackerSummary pointTracker={this.state} onClose={ this.props.buttonClick }/> : pointTrackerForm }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  synopsisReportLink: state.synopsisReportLink,
  myRole: state.myProfile.role,
});

const mapDispatchToProps = dispatch => ({
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
  createSynopsisReport: pointTracker => dispatch(pointTrackerActions.createSynopsisReport(pointTracker)),
});

PointTrackerForm.propTypes = {
  synopsisReportLink: PropTypes.string,
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  createSynopsisReport: PropTypes.func,
  buttonClick: PropTypes.func,
  content: PropTypes.object,
  myRole: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(PointTrackerForm);
