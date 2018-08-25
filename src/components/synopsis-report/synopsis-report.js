import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker } = props;
  return (
    <div className="synopsis-report">
      <h1>Rainier Athletes { pointTracker.studentName } Weekly Synopsis. { pointTracker.date.toString() }</h1>

      <h2>Point Sheet Summary</h2>
      <p>
      { 
        pointTracker.subjects
          .filter(subject => subject.teacher)
          .map(subject => `@${subject.teacher}`)
          .join(', ')
      }
      </p>

      <p>Please find the weekly Rainier Athletes synopsis report for { pointTracker.studentName } below. Keep in mind that { pointTracker.studentName }’s family are also included on Basecamp.</p>

      <p>Rainier Athletes students earn full playing time by achieving goals in the classroom which will show up in the table below as at least 75% points and at least 70% grade in every class.</p>
      
      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Class</th>
            <th>Grade</th>
            <th>Stamps</th>
            <th>Xs</th>
            <th>Blanks</th>
            <th>Point %</th>
          </tr>
        </thead>
        <tbody>
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

      <h3>Table Key</h3>
      <p>Stamps = 2 points (RA goal achieved in class)</p>
      <p>X = 1 point (RA goal not achieved, constructive conversation took place</p>
      <p>Blank = 0 points (no teacher/student conversation took place)</p>
        
      <p>Based on these points, { pointTracker.studentName } earned { pointTracker.synopsisComments.extraPlayingTime } amount of playing time in the upcoming game! { pointTracker.synopsisComments.mentorGrantedPlayingTime }</p>

      <h3>Student Action Items</h3>
      <p>{ pointTracker.synopsisComments.studentActionItems }</p>

      <h3>Sports Update</h3>
      <p>{ pointTracker.synopsisComments.sportsUpdate }</p>

      <p>Please feel free to respond to this message directly with any questions or concerns!</p>

      <p>{ pointTracker.synopsisComments.additionalComments }</p>

      <p>Best,</p>
      <p>[Your Name]</p>
      <p>RA [Your School] Mentor</p>

    </div>
  );
}

SynopsisReport.propTypes = {
  pointTracker: PropTypes.object,
};
