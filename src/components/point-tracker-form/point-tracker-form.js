import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReportingPeriods } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import PointTrackerSummary from '../point-tracker-summary/point-tracker-summary';
import * as pointTrackerActions from '../../actions/point-tracker';
import waitingGif from '../../assets/loading_icon.gif';

import './point-tracker-form.scss';

const emptyPointTracker = {
  date: new Date(Date.now()).toDateString(),
  title: '',
  student: '',
  studentName: '',
  subjects: [{
    subjectName: 'Tutorial',
    scoring: {
      excusedDays: '',
      stamps: '',
      halfStamps: '',
    },
    grade: '',
  }],
  surveyQuestions: {
    mentorAttendedCheckin: false,
    metFaceToFace: false,
    hadOtherCommunication: false,
    hadNoCommunication: false,
    scoreSheetTurnedIn: false,
    scoreSheetLostOrIncomplete: false,
    scoreSheetWillBeLate: false,
    scoreSheetOther: false,
    scoreSheetOtherReason: '',
    synopsisInformationComplete: false,
    synopsisInformationIncomplete: false,
    synopsisCompletedByRaStaff: false,
  },
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
  mentorAttendedCheckin: 'Mentor Attended Checkin',
  metFaceToFace: 'Met Face-to-Face',
  hadOtherCommunication: 'Had Other Communication',
  hadNoCommunication: 'Had No Communication',
  scoreSheetTurnedIn: 'Score Sheet Turned In',
  scoreSheetLostOrIncomplete: 'Score Sheet Lost or Incomplete',
  scoreSheetWillBeLate: 'Score Sheet will be Late',
  scoreSheetOther: 'Score Sheet Other',
  synopsisInformationComplete: 'Synopsis Information Complete',
  synopsisInformationIncomplete: 'Synopsis Information Incomplete',
  synopsisCompletedByRaStaff: 'Synopsis Completed by RA Staff',
  mentorGrantedPlayingTimeComments: 'Mentor Granted Playing Time Explanation',
  studentActionItems: 'Student Action Items',
  sportsUpdate: 'Sports Update',
  additionalComments: 'Additional Comments',
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
            } else {
              newSubject.scoring[categoryName] = Math.min(Math.max(parseInt(event.target.value, 10), 0), 8);
            }

            return newSubject;
          }
          return subject;
        });

      newState.subjects = newSubjects;
      return newState;
    });
  }

  handleSurveyQuestionChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.surveyQuestions[name] = checked;
      return newState;
    });
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

  handleSubmit = (event) => {
    event.preventDefault();
    const pointTracker = this.state;
    delete pointTracker._id;
    console.log('handleSubmit', pointTracker.title);
    this.setState({ ...this.state, waitingOnSaves: true });
    this.props.createPointTracker(pointTracker);
    this.props.createSynopsisReport(pointTracker);

    this.setState({ pointTracker: emptyPointTracker });
  }

  getTeacherName = (teacherId) => {
    return this.props.teachers
      .filter(teacher => teacher._id === teacherId)
      .map(teacher => `${teacher.firstName} ${teacher.lastName}`)[0] || '';
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

      return totalTokensEarned;
    });

    const totalClassScoreSum = totalEarnedTokens.reduce((acc, cur) => acc + cur, 0);

    let earnedPlayingTime = 'None of game';
    if (totalClassScoreSum >= 16) earnedPlayingTime = 'One quarter';
    if (totalClassScoreSum >= 21) earnedPlayingTime = 'Two quarters';
    if (totalClassScoreSum >= 25) earnedPlayingTime = 'Three quarters';
    if (totalClassScoreSum >= 29) earnedPlayingTime = 'All but start';
    if (totalClassScoreSum >= 30) earnedPlayingTime = 'Entire game';
    if (earnedPlayingTime !== this.state.earnedPlayingTime) this.setState({ ...this.state, earnedPlayingTime });
    console.groupEnd('calcPlayingTime');
    return earnedPlayingTime;
  }

  render() {
    const reportingPeriods = getReportingPeriods();
    console.log(this.props.content);
    const selectOptionsJSX = (
      <section>
        <div className="select-student">
        <label htmlFor="" onClick={ this.handleStudentSelect}>Student</label>
          <span>{this.props.content.firstName} {this.props.content.lastName }</span>
        </div>
        <div className="select-date">
          <label htmlFor="">Select Reporting Period</label>
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
        <div className="clearfix"></div>
      </section>
    );

    const surveyQuestionsJSX = (
      <fieldset>
        <div className="survey-questions">
        {Object.keys(this.state.surveyQuestions)
          .filter(keyName => names[keyName])
          .map((surveyQuestion, i) => (
            <div className="survey-question-container" key={ i }>
              <input
                type="checkbox"
                name={ surveyQuestion }
                onChange= { this.handleSurveyQuestionChange }
                checked={ this.state.surveyQuestions.surveyQuestion }/>
              <label htmlFor={ surveyQuestion }>{ names[surveyQuestion] }</label>
            </div>
          ))}
        </div>
    </fieldset>
    );

    // add back in calc plauing time calc below
    const synopsisCommentsJSX = (
      <div className="synopsis">
        <h4>Synopsis</h4>
        <p>Playing Time Earned: { this.calcPlayingTime() }</p>

        <label htmlFor="mentorGrantedPlayingTime">Mentor Granted Playing Time:</label>
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
                  <label htmlFor={ synopsisComment }>{ names[synopsisComment] }</label>
                  <textarea
                    name={ synopsisComment }
                    onChange={ this.handleSynopsisCommentChange }
                    value={ this.state.synopsisComments[synopsisComment] }
                    rows="6"
                    cols="80"
                    wrap="hard"
                    placeholder={ names[synopsisComment] }
                  />
                </div>
              );
            })
        }
      </div>
    );

    const displaySummaryJSX = () => {
      // let link;
      console.log('displaySummaryJSX saved:', this.state.synopsisSaved);
      if (this.state.synopsisSaved) {
        console.log('this.state.title', this.state.title);
        // link = this.props.synopsisReportLink;
        // this.setState({ ...this.state, synopsisSaved: false, synopsisLink: link });
        return (<PointTrackerSummary pointTracker={this.state}/>);
      }
      return null;
    };

    return (
      <div className="points-tracker panel point-tracker-modal">
        <button className="close-modal" onClick={ this.props.buttonClick }>x</button>
        <form className="data-entry" onSubmit={ this.handleSubmit }>
          <h2>POINT TRACKER TABLE</h2>
          { selectOptionsJSX }
          { surveyQuestionsJSX }
          <PointTrackerTable
            handleSubjectChange={ this.handleSubjectChange }
            subjects={ this.state.subjects }
            getTeacherName={ this.getTeacherName }
            teachers={ this.props.teachers }
            deleteSubject= { this.deleteSubject }
            createSubject={ this.createSubject }
          />
          { synopsisCommentsJSX }
          { this.state.waitingOnSaves ? <img src={waitingGif} alt="waiting" /> : <button className="submit-report" type="submit">Submit Point Tracker</button> }
          { displaySummaryJSX() }
        </form>
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
