import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker, student } = props;

  let studentsSchool = student.studentData.school.find(s => s.currentSchool);
  studentsSchool = studentsSchool ? studentsSchool.schoolName : '';
  const isMiddleSchool = studentsSchool ? !studentsSchool.isElementarySchool : true;
  const playingTimeOverride = pointTracker.mentorGrantedPlayingTime !== '' 
    && pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime;
  
  const maxPointsPossible = subject => (subject.subjectName.toLowerCase() !== 'tutorial' 
    ? (40 - subject.scoring.excusedDays * 8) 
    : 8 - subject.scoring.excusedDays * 2
  );  
  
  // styling for this html is in actions/point-tracker.js 
  const scoreTableJSX = (
    <table className="scoring-table">
      <thead>
        <tr>
          {isMiddleSchool ? <th>Teacher</th> : ''}
          <th>Class</th>
          {isMiddleSchool ? <th>Grade</th> : ''}
          <th>Excused</th>
          <th>Stamps</th>
          <th>Xs</th>
          <th>Blanks</th>
          <th>Point %</th>
        </tr>
      </thead>
      <tbody>
        {pointTracker.subjects.map((subject, row) => (
          <tr key={ subject._id.toString() }>
            {isMiddleSchool ? <td>{ subject.teacher.lastName }</td> : ''}
            <td key={ `${subject._id.toString()}${row}1` }>{ subject.subjectName }</td>
            {isMiddleSchool ? <td>{ subject.grade }</td> : ''}
            <td key={ `${subject._id.toString()}${row}2` } >{ subject.scoring.excusedDays} </td>
            <td key={ `${subject._id.toString()}${row}3` }>{ subject.scoring.stamps }</td>
            <td key={ `${subject._id.toString()}${row}4` }>{ subject.scoring.halfStamps }</td>
            <td key={ `${subject._id.toString()}${row}5` }>{ 20 - subject.scoring.excusedDays - subject.scoring.stamps - subject.scoring.halfStamps }</td>
            <td key={ `${subject._id.toString()}${row}6` }>{ Math.round(((subject.scoring.stamps * 2 + subject.scoring.halfStamps) / maxPointsPossible(subject)) * 100)}</td>
          </tr>
        {
          pointTracker.subjects.map((subject, i) => {
            const teacherName = subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : '';

            return (
              <tr key={ i }>
                <td>{ teacherName }</td>
                <td>{ subject.subjectName }</td>
                <td>{ subject.grade }</td>
                <td>{ subject.scoring.stamps }</td>
                <td>{ subject.scoring.halfStamps }</td>
                <td>{ subject.scoring.excusedDays }</td>
                <td>{ 0 }</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
      )
        <div>
          <h3>Table Key</h3>
            <p>Stamps = 2 points (RA goal achieved in class)</p>
            <p>X = 1 point (RA goal not achieved, constructive conversation took place</p>
            <p>Blank = 0 points (no teacher/student conversation took place)</p>
            
            <p>Based on these points, { pointTracker.studentName } earned playing time amounting to { pointTracker.earnedPlayingTime } in the upcoming game. { pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime ? `${pointTracker.studentName}'s mentor has selected playing time of ${pointTracker.mentorGrantedPlayingTime} however. "${pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}"` : '' }</p>

          <h3>Student Action Items</h3>
            <p>{ pointTracker.synopsisComments.studentActionItems }</p>

          <h3>Sports Update</h3>
            <p>{ pointTracker.synopsisComments.sportsUpdate }</p>

            <p>Please feel free to respond to this message directly with any questions or concerns!</p>

            <p>{ pointTracker.synopsisComments.additionalComments }</p>

            <p>Best,</p>

            <p>RA {student.studentData.school.length > 0 ? studentsSchool.schoolName : null } Mentor</p>

    </div>
  );
}

SynopsisReport.propTypes = {
  pointTracker: PropTypes.object,
  student: PropTypes.object,
};
