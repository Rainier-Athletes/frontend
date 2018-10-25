import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker, student } = props;

  const studentsSchool = student.studentData.school.find(s => s.currentSchool);
  const studentsSchoolName = studentsSchool ? studentsSchool.schoolName : 'Score Table';
  const isMiddleSchool = studentsSchool ? !studentsSchool.isElementarySchool : true;
  const playingTimeOverride = pointTracker.mentorGrantedPlayingTime !== ''
    && pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime;

  const pointPercentage = (subject) => {
    const { excusedDays, stamps, halfStamps } = subject.scoring;
    const maxPointsPossible = subject.subjectName.toLowerCase() !== 'tutorial'
      ? (40 - excusedDays * 8)
      : 8 - excusedDays * 2;
    const pointsEarned = 2 * stamps + halfStamps;
    const percentage = pointsEarned / maxPointsPossible;
    return Math.round((percentage * 100));
  };

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
        {pointTracker.subjects.map((subject, row) => {
          if (subject.subjectName.toLowerCase() !== 'tutorial') {
            return (
            <tr key={ subject.subjectName }>
              {isMiddleSchool ? <td>{subject.teacher.lastName}</td> : ''}
              <td key={ `${subject.subjectName}${row}1` }>{ subject.subjectName }</td>
              {isMiddleSchool ? <td>{ subject.grade }</td> : ''}
              <td key={ `${subject.subjectName}${row}2` } >{ subject.scoring.excusedDays} </td>
              <td key={ `${subject.subjectName}${row}3` }>{ subject.scoring.stamps }</td>
              <td key={ `${subject.subjectName}${row}4` }>{ subject.scoring.halfStamps }</td>
              <td key={ `${subject.subjectName}${row}5` }>{ 20 - subject.scoring.excusedDays - subject.scoring.stamps - subject.scoring.halfStamps }</td>
              <td key={ `${subject.subjectName}${row}6` }>{ pointPercentage(subject) }</td>
            </tr>
            );
          }
          return undefined;
        })}
        {isMiddleSchool
          ? pointTracker.subjects.map((subject, row) => {
            if (subject.subjectName.toLowerCase() === 'tutorial') {
              return (
              <tr key={ subject.subjectName }>
                {isMiddleSchool ? <td></td> : ''}
                <td key={ `${subject.subjectName}${row}1` }>{ subject.subjectName }</td>
                <td></td>
                <td key={ `${subject.subjectName}${row}2` } >{ subject.scoring.excusedDays} </td>
                <td key={ `${subject.subjectName}${row}3` }>{ subject.scoring.stamps }</td>
                <td key={ `${subject.subjectName}${row}4` }>{ subject.scoring.halfStamps }</td>
                <td key={ `${subject.subjectName}${row}5` }>{ 20 - subject.scoring.excusedDays - subject.scoring.stamps - subject.scoring.halfStamps }</td>
                <td key={ `${subject.subjectName}${row}6` }>{ pointPercentage(subject) }</td>
              </tr>
              );
            }
            return '';
          })
          : ''}
      </tbody>
    </table>
    </React.Fragment>;
  
  const sportsInfoJSX = <React.Fragment>
    <h3>Team Information</h3>
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Sport</th>
          <th>League</th>
          <th>Calendar</th>
        </tr>
      </thead>
      <tbody>
        {student.studentData.sports.filter(s => s.currentlyPlaying).map((sport, i) => (
          <tr key={sport.sport}>
            <td key={`${sport.team}${i}`}>{sport.team}</td>
            <td key={`${sport.sport}${i}`}>{sport.sport}</td>
            <td key={`${sport.league}${i}`}>{sport.league}</td>
            <td key={`calendar${i}`}><a href={sport.teamCalendarUrl} target="_blank" rel="noopener noreferrer">Calendar</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  </React.Fragment>;

  const studentCalendarJSX = <React.Fragment>
    <h3><a href={student.studentData.googleCalendarUrl} target="_blank" rel="noopener noreferrer">Student&rsquo;s Google Calendar</a></h3>
  </React.Fragment>;

  const playingTimeJSX = <React.Fragment>
    <div className="row">
      <div className="left">
        <h3>Playing Time Earned</h3>
        <p>{pointTracker.earnedPlayingTime}</p>
      </div>
      <div className="right">
        {playingTimeOverride
          ? <div>
              <h3>Mentor Granted Playing Time</h3>
                <p>{pointTracker.mentorGrantedPlayingTime}</p>
            </div>
          : null}
      </div>
    </div>
  </React.Fragment>;

  const mentorCommentsJSX = playingTimeOverride
    ? <div>
        <h3>Mentor&#39;s Comments re: Playing Time</h3>
          <p>{pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}</p>
      </div>
    : null;

  const pointTrackerHTML = <React.Fragment>
    <body>
      <div className="image">
        <img style={{ WebkitUserSelect: 'none' }} src="http://portal.rainierathletes.org/2dbb0b1d137e14479018b5023d904dec.png" />
      </div>
          <h1>{pointTracker.title.split(':')[0]}</h1>
          <h2>{pointTracker.title.split(':')[1].trim()}</h2>
          <h3>{studentsSchoolName}</h3>
          {scoreTableJSX}
          {studentCalendarJSX}
          {sportsInfoJSX}
          {playingTimeJSX} 
          {mentorCommentsJSX}        
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
