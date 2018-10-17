import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker, student } = props;

  const studentsSchool = student.studentData.school.find(s => s.currentSchool);
  const studentsSchoolName = studentsSchool ? studentsSchool.schoolName : '';
  const isMiddleSchool = studentsSchool ? !studentsSchool.isElementarySchool : true;
  const playingTimeOverride = pointTracker.mentorGrantedPlayingTime !== '' 
    && pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime;

  const maxPointsPossible = subject => (subject.subjectName.toLowerCase() !== 'tutorial' 
    ? (40 - subject.scoring.excusedDays * 8) 
    : 8 - subject.scoring.excusedDays * 2
  );  

  // styling for this html is in actions/point-tracker.js
  const scoreTableJSX = <React.Fragment>
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
          <tr key={ subject.subjectName }>
            {isMiddleSchool ? <td>{ subject.subjectName.toLowerCase() !== 'tutorial' ? subject.teacher.lastName : '' }</td> : ''}
            <td key={ `${subject.subjectName}${row}1` }>{ subject.subjectName }</td>
            {isMiddleSchool ? <td>{ subject.grade }</td> : ''}
            <td key={ `${subject.subjectName}${row}2` } >{ subject.scoring.excusedDays} </td>
            <td key={ `${subject.subjectName}${row}3` }>{ subject.scoring.stamps }</td>
            <td key={ `${subject.subjectName}${row}4` }>{ subject.scoring.halfStamps }</td>
            <td key={ `${subject.subjectName}${row}5` }>{ 20 - subject.scoring.excusedDays - subject.scoring.stamps - subject.scoring.halfStamps }</td>
            <td key={ `${subject.subjectName}${row}6` }>{ Math.round(((subject.scoring.stamps * 2 + subject.scoring.halfStamps) / maxPointsPossible(subject)) * 100)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </React.Fragment>;

  const pointTrackerHTML = <React.Fragment>
    <body>
      <div className="image">
        <img style={{ WebkitUserSelect: 'none' }} src="http://portal.rainierathletes.org/2dbb0b1d137e14479018b5023d904dec.png" /> 
      </div>
          <h3>Report for: {pointTracker.title}</h3>
          <h3>{studentsSchoolName}</h3>
            {scoreTableJSX}
          <h3>Playing Time Earned: </h3>
            <p>{pointTracker.earnedPlayingTime}</p>
              {playingTimeOverride
                ? <div>
                    <h3>Mentor Granted Playing Time</h3>
                      <p>{pointTracker.mentorGrantedPlayingTime}</p>
                  </div>
                : null}
              {playingTimeOverride
                ? <div>
                    <h3>Mentor&#39;s Comments re: Playing Time</h3>
                      <p>{pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}</p>
                  </div>
                : null}
          <h3>Student Action Items</h3>      
            <p>{pointTracker.synopsisComments.studentActionItems}</p>
          <h3>Sports Update</h3>      
            <p>{pointTracker.synopsisComments.sportsUpdate}</p>
          <h3>Additional Comments</h3>      
            <p>{pointTracker.synopsisComments.additionalComments}</p>

    </body>
  </React.Fragment>;

  return pointTrackerHTML;
}

SynopsisReport.propTypes = {
  pointTracker: PropTypes.object,
  student: PropTypes.object,
};
