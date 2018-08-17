import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convertDateToValue } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import * as pointTrackerActions from '../../actions/point-tracker';
import './point-tracker-form.scss';

const defaultState = {
  _id: null,
  date: Date.now(),
  student: null,
  subjects: [{
    subjectName: 'Social Studies',
    teacher: '5b75ada6b174d0246b103d63',
    scoring: {
      excusedDays: 1,
      stamps: 14,
      halfStamps: 3,
      tutorials: 1,
    },
    grade: 70,
  }, {
    subjectName: 'Math',
    teacher: '5b75ada6b174d0246b103d68',
    scoring: {
      excusedDays: 1,
      stamps: 12,
      halfStamps: 6,
      tutorials: 0,
    },
    grade: 70,
  }, {
    subjectName: 'Biology',
    teacher: '5b75ada6b174d0246b103d6d',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      halfStamps: 1,
      tutorials: 2,
    },
    grade: 70,
  }, {
    subjectName: 'Art',
    teacher: '5b75ada6b174d0246b103d72',
    scoring: {
      excusedDays: 1,
      stamps: 14,
      halfStamps: 3,
      tutorials: 1,
    },
    grade: 50,
  }, {
    subjectName: 'PE',
    teacher: '5b75ada6b174d0246b103d77',
    scoring: {
      excusedDays: 1,
      stamps: 12,
      halfStamps: 6,
      tutorials: 0,
    },
    grade: 70,
  }, {
    subjectName: 'English',
    teacher: '5b75ada6b174d0246b103d7c',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      halfStamps: 1,
      tutorials: 2,
    },
    grade: 70,
  }, {
    subjectName: 'Spanish',
    teacher: '5b75ada6b174d0246b103d86',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      halfStamps: 1,
      tutorials: 2,
    },
    grade: 70,
  }, {
    subjectName: 'Tutorial',
    teacher: '5b75ada62c7a4f246bb31ed1',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      halfStamps: 1,
      tutorials: 2,
    },
    grade: null,
  }],
  surveyQuestions: {
    mentorAttendedCheckin: true,
    metFaceToFace: true,
    hadOtherCommunication: true,
    hadNoCommunication: true,
    scoreSheetTurnedIn: true,
    scoreSheetLostOrIncomplete: true,
    scoreSheetWillBeLate: true,
    scoreSheetOther: true,
    scoreSheetOtherReason: 'other reason',
    synopsisInformationComplete: true,
    synopsisInformationIncomplete: true,
    synopsisCompletedByRaStaff: true,
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
  fetchStudents: studentIds => dispatch(pointTrackerActions.fetchStudents(studentIds)),
  fetchTeachers: studentIds => dispatch(pointTrackerActions.fetchTeachers(studentIds)),
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
});

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      teachers: [],
      pointTracker: defaultState,
    };
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
            if (categoryName === 'grade') {
              newSubject.grade = value;
            } else {
              newSubject.scoring[categoryName] = value;
            }
           
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

  getTeacherName = (teacherId) => {
    return this.state.teachers
      .filter(teacher => teacher._id === teacherId)
      .map(teacher => `${teacher.firstName} ${teacher.lastName}`)[0] || '';
  }

  deleteSubject = (subjectName, teacherId) => {
    this.setState((prevState) => {
      const newState = { ...prevState };

      newState.pointTracker.subjects = newState.pointTracker.subjects.filter((subject) => {
        return subject.subjectName !== subjectName && subject.teacher !== teacherId;
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

      newState.pointTracker.subjects.push(newSubject);

      return newState;
    });
  }

  componentDidMount() {
    this.props.fetchStudents()
      .then((students) => {
        const updatedStudents = students || [];
        this.setState({ students: updatedStudents });
      })
      .catch(console.error); // eslint-disable-line

    this.props.fetchTeachers()
      .then((teachers) => {
        const updatedTeachers = teachers || [];
        this.setState({ teachers: updatedTeachers });
      });
  }

  handleStudentSelect = (event) => {
    event.preventDefault();
    const studentId = event.target.value;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.studentId = studentId;

      return newState;
    });
  }

  calcPlayingTime = () => {
    const { subjects } = this.state.pointTracker;
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

      if (subjectName === 'Tutorial') gradeScore = 0;
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
      <section>
        <div className="select-student">
        <label htmlFor="">Select Student</label>
          <select onChange={ this.handleStudentSelect } >
          <option disabled selected>Select Student</option>
          { this.state.students.map(student => (
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
          value={ convertDateToValue(this.state.pointTracker.date) }
          />
        </div>
        <div className="clearfix"></div>
      </section>
    );
    
    const surveyQuestionsJSX = (
      <fieldset>
        <div className="survey-questions">
             <input
                type="checkbox"
                name="attendedCheckin"
                onChange= { this.handleSurveyQuestionChange }
                checked={ this.state.pointTracker.surveyQuestions.attendedCheckin }/>
              <label htmlFor="attendedCheckin">Attended Check-In</label>
        </div>
  
      <div className="survey-questions">
      <input
        type="checkbox"
        name="metFaceToFace"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.metFaceToFace }/>
      <label htmlFor="metFaceToFace">Met Face-to-Face</label>
      </div>

      <div className="survey-questions">
      <input
        type="checkbox"
        name="hadOtherCommunication"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.hadOtherCommunication }/>
      <label htmlFor="hadOtherCommunication">Had Other Communication</label>
      </div>

      <div className="survey-questions">
      <input
        type="checkbox"
        name="scoreSheetTurnedIn"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.scoreSheetTurnedIn }/>
      <label htmlFor="scoreSheetTurnedIn">Score Sheet Turned In</label>
      </div>
    </fieldset>
    );
    
    const synopsisCommentsJSX = (
      <div className="synopsis">
      <h4>Synopsis</h4>

      <label htmlFor="extraPlayingTime">Extra Playing Time</label>
      <textarea
        name="extraPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.extraPlayingTime }
        rows="8"
        cols="80"
        wrap="hard"
      />

      <p>Recommended playing time: { this.calcPlayingTime() }</p>

      <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
      
      <select
        name="mentorGrantedPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.mentorGrantedPlayingTime }
        >
        <option value="" defaultValue>Select Playing Time</option>
        <option value="Entire Game">Entire Game</option>
        <option value="All but start">All but start</option>
        <option value="Three quarters">Three quarters</option>
        <option value="Two quarters">Two quarters</option>
        <option value="One quarter">One quarter</option>
        <option value="None of game">None of game</option>
      </select>

      <label htmlFor="extraPlayingTime">Extra Playing Time</label>
      <textarea
        name="extraPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.extraPlayingTime }
        rows="8"
        cols="80"
        wrap="hard"
      />


      <label htmlFor="studentActionItems">Student Action Items/Academic Update</label>
      <textarea
        name="studentActionItems"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.studentActionItems }
        rows="8"
        cols="80"
        wrap="hard"
      />

      <label htmlFor="sportsUpdate">Sports Update</label>
      <textarea
        name="sportsUpdate"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.sportsUpdate }
        rows="8"
        cols="80"
        wrap="hard"
        />

      <label htmlFor="additionalComments">Additional Comments</label>
      <textarea
        name="additionalComments"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.additionalComments }
        rows="8"
        cols="80"
        wrap="hard"
      />
    </div>
    );


    return (
      <div className="points-tracker">
        <React.Fragment>
          <form className="data-entry" onSubmit={ this.handleSubmit }>
            <h2>POINT TRACKER TABLE</h2>
              {/* <h4>Point Sheet and Grades</h4> */}
              { selectOptionsJSX }
              { surveyQuestionsJSX }
                <PointTrackerTable
                  handleSubjectChange={ this.handleSubjectChange }
                  subjects={ this.state.pointTracker.subjects }
                  getTeacherName={ this.getTeacherName }
                  teachers={ this.state.teachers }
                  deleteSubject= { this.deleteSubject }
                  createSubject={ this.createSubject }
              />
              { synopsisCommentsJSX }
                
            <button className="submit-report" type="submit">Submit Point Tracker</button>
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
  fetchTeachers: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(PointTrackerForm);
