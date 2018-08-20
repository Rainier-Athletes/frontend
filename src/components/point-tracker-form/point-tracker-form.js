import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convertDateToValue } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import * as pointTrackerActions from '../../actions/point-tracker';
import './point-tracker-form.scss';

const emptyPointTracker = {
  _id: '',
  date: Date.now(),
  student: '',
  studentName: '',
  subjects: [{
    subjectName: 'Tutorial',
    teacher: '',
    scoring: {
      excusedDays: 0,
      stamps: 0,
      halfStamps: 0,
      tutorials: 0,
    },
    grade: 0,
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
  synopsisComments: {
    extraPlayingTime: '',
    mentorGrantedPlayingTime: '',
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
  extraPlayingTime: 'Extra Playing Time',
  mentorGrantedPlayingTime: 'Mentor Granted Playing Time',
  studentActionItems: 'Student Action Items',
  sportsUpdate: 'Sports Update',
  additionalComments: 'Additional Comments',
};

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = emptyPointTracker;
  }

  handleDateChange = (event) => {
    const { value } = event.target;
    const [year, month, day] = value.split('-'); 
    const date = new Date(
      parseInt(year, 10), 
      parseInt(month, 10) - 1, 
      parseInt(day, 10),
    );
    
    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.date = date.getTime();
      return newState;
    });
  }

  handleSubjectChange = (event) => {
    const { name } = event.target;
    const value = parseInt(event.target.value, 10);
    
    this.setState((prevState) => {
      const newState = { ...prevState };
      const [subjectName, categoryName] = name.split('-');
      
      const newSubjects = newState.subjects
        .map((subject) => {
          if (subject.subjectName === subjectName) {
            const newSubject = { ...subject };
            newSubject.scoring[categoryName] = value;
            if (categoryName === 'grade') {
              newSubject.grade = value;
            } else {
              newSubject.scoring[categoryName] = value;
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
    const { pointTracker } = this.state;
    delete pointTracker._id;

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
          excusedDays: null,
          stamps: null,
          halfStamps: null,
          tutorials: null,
        },
        grade: null,
      };

      newState.subjects.push(newSubject);

      return newState;
    });
  }

  handleStudentSelect = (event) => {
    event.preventDefault();
    const studentId = event.target.value;
    const selectedStudent = this.props.students.filter(student => student._id === studentId)[0];
    const { lastPointTracker } = selectedStudent.studentData;

    this.setState((prevState) => {
      let newState = { ...prevState };
      newState = lastPointTracker || emptyPointTracker;
      newState.student = studentId;
      newState.studentName = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
      return newState;
    });
  }

  calcPlayingTime = () => {
    const { subjects } = this.state;
    const totalClassScores = subjects.map((subject) => {
      const { grade, subjectName } = subject;
      const { excusedDays, stamps, halfStamps } = subject.scoring;
      const pointsEarned = 2 * stamps + halfStamps;
      const pointsPossible = subjectName.toLowerCase === 'tutorial' ? 10 - excusedDays * 2 : 40 - excusedDays * 8;
      const pointPercentage = pointsEarned / pointsPossible;
      
      let pointScore = 0;
      if (pointPercentage >= 0.50) pointScore = 1;
      if (pointPercentage >= 0.75) pointScore = 2;

      let gradeScore = 0;
      if (grade >= 0.6) gradeScore = 1;
      if (grade >= 0.7) gradeScore = 2;

      if (subjectName.toLowerCase() === 'tutorial') gradeScore = 0;
      const totalClassScore = pointScore + gradeScore;
      return totalClassScore;
    });
    
    const totalClassScoreSum = totalClassScores.reduce((acc, cur) => acc + cur, 0);
    if (totalClassScoreSum >= 30) return 'Entire game';
    if (totalClassScoreSum >= 29) return 'All but start';
    if (totalClassScoreSum >= 25) return 'Three quarters';
    if (totalClassScoreSum >= 21) return 'Two quarters';
    if (totalClassScoreSum >= 16) return 'One quarter';
    return 'None of game';
  }

  render() {
    const selectOptionsJSX = (
      <section required>
        <div className="select-student">
        <label htmlFor="">Select Student</label>
          <select onChange={ this.handleStudentSelect } >
          <option disabled selected value="">Select Student</option>
          { this.props.students.map(student => (
              <option 
                placeholder="Select" 
                key={ student._id } 
                value={ student._id }
              >{ `${student.firstName} ${student.lastName}`}
              </option>
          ))}
          </select>
      </div>
      <div className="select-date">
        <label htmlFor="">Select Date</label>
        <input
          name="date"
          type="date"
          onChange={ this.handleDateChange }
          value={ convertDateToValue(this.state.date) }
          required
          />
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
    
    const synopsisCommentsJSX = (
      <div className="synopsis">
        <h4>Synopsis</h4>
        <p>Recommended playing time: { this.calcPlayingTime() }</p>

        <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
        <select
          name="mentorGrantedPlayingTime"
          onChange={ this.handleSynopsisCommentChange }
          value={ this.state.synopsisComments.mentorGrantedPlayingTime }
          required
          >
          <option value="" defaultValue>Select Playing Time</option>
          <option value="Entire Game">Entire Game</option>
          <option value="All but start">All but start</option>
          <option value="Three quarters">Three quarters</option>
          <option value="Two quarters">Two quarters</option>
          <option value="One quarter">One quarter</option>
          <option value="None of game">None of game</option>
        </select>

        { 
          Object.keys(this.state.synopsisComments)
            .filter(keyName => names[keyName])
            .map((synopsisComment, i) => (
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
            ))
        }
      </div>
    );

    return (
      <div className="points-tracker">
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
          <button className="submit-report" type="submit">Submit Point Tracker</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  students: state.students,
  teachers: state.teachers,
});

const mapDispatchToProps = dispatch => ({
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
  createSynopsisReport: pointTracker => dispatch(pointTrackerActions.createSynopsisReport(pointTracker)),
});

PointTrackerForm.propTypes = {
  students: PropTypes.array,
  teachers: PropTypes.array,
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  createSynopsisReport: PropTypes.func,
  fetchStudents: PropTypes.func,
  fetchTeachers: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(PointTrackerForm);
