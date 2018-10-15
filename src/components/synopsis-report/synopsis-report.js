import React from 'react';
import PropTypes from 'prop-types';
import './synopsis-report.scss';

export default function SynopsisReport(props) {
  const { pointTracker, student } = props;

  // const submitterName = `${pointTracker.mentor.firstName} ${pointTracker.mentor.lastName}`;
  let studentsSchool = student.studentData.school.find(s => s.currentSchool);
  studentsSchool = studentsSchool ? studentsSchool.schoolName : '';
  const isMiddleSchool = studentsSchool ? !studentsSchool.isElementarySchool : true;
  const playingTimeOverride = pointTracker.mentorGrantedPlayingTime !== '' 
    && pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime;
  
  const maxPointsPossible = subject => (subject.subjectName.toLowerCase() !== 'tutorial' 
    ? (40 - subject.scoring.excusedDays * 8) 
    : 8 - subject.scoring.excusedDays * 2
  );  
  
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
        {pointTracker.subjects.map(subject => (
          <tr key={ subject._id }>
            {isMiddleSchool ? <td>{ subject.teacher.lastName }</td> : ''}
            <td>{ subject.subjectName }</td>
            {isMiddleSchool ? <td>{ subject.grade }</td> : ''}
            <td>{ subject.scoring.excusedDays} </td>
            <td>{ subject.scoring.stamps }</td>
            <td>{ subject.scoring.halfStamps }</td>
            <td>{ 20 - subject.scoring.excusedDays - subject.scoring.stamps - subject.scoring.halfStamps }</td>
            <td>{ Math.round(((subject.scoring.stamps * 2 + subject.scoring.halfStamps) / maxPointsPossible(subject)) * 100)}</td>
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
      <h2>{studentsSchool}, Report for {pointTracker.title}</h2>
      {scoreTableJSX}
      <h3>Playing Time Earned</h3>
      <p>{pointTracker.earnedPlayingTime}</p>
      {playingTimeOverride
        ? <div><h3>Mentor Granted Playing Time</h3><p>{pointTracker.mentorGrantedPlayingTime}</p></div>
        : null}
      {playingTimeOverride
        ? <div><h3>Mentor&#39;s Comments re Playing Time</h3><p>{pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}</p></div>
        : null}
      <h3>Student Action Items</h3>      
      <p>{pointTracker.synopsisComments.studentActionItems}</p>
      <h3>Sports Update</h3>      
      <p>{pointTracker.synopsisComments.sportsUpdate}</p>
      <h3>Additional Comments</h3>      
      <p>{pointTracker.synopsisComments.additionalComments}</p>
    </body>
  {/* <script>
    var table = document.createElement('table');
    for (var i = 0; i < 4; i++){
        var tr = document.createElement('tr');   
    
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
    
        var text1 = document.createTextNode('${pointTracker.subjects[0].subjectName}');
        var text2 = document.createTextNode('Text2');
    
        td1.appendChild(text1);
        td2.appendChild(text2);
        tr.appendChild(td1);
        tr.appendChild(td2);
    
        table.appendChild(tr);
    }
    document.body.appendChild(table);
  </script> */}
  </React.Fragment>;

  return pointTrackerHTML;

  // return (
  //   <div className="synopsis-report">
  //     <h1>{ pointTracker.title }</h1>

  //     <h2>Point Sheet Summary</h2>
  //     <p>
  //     {
  //       pointTracker.subjects
  //         .filter(subject => subject.teacher)
  //         .map(subject => `@${subject.teacher}`)
  //         .join(', ')
  //     }
  //     </p>

  //     <p>Please find the weekly Rainier Athletes synopsis report for { pointTracker.studentName } below. Keep in mind that { pointTracker.studentName }’s family are also included on Basecamp.</p>

  //     <p>Rainier Athletes students earn full playing time by achieving goals in the classroom which will show up in the table below as at least 75% points and at least a C grade in every class.</p>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Teacher</th>
  //           <th>Class</th>
  //           <th>Grade</th>
  //           <th>Stamps</th>
  //           <th>Xs</th>
  //           <th>Blanks</th>
  //           <th>Point %</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //       {
  //         pointTracker.subjects.map((subject, i) => {
  //           const teacherName = subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : '';

  //           return (
  //             <tr key={ i }>
  //               <td>{ teacherName }</td>
  //               <td>{ subject.subjectName }</td>
  //               <td>{ subject.grade }</td>
  //               <td>{ subject.scoring.stamps }</td>
  //               <td>{ subject.scoring.halfStamps }</td>
  //               <td>{ subject.scoring.excusedDays }</td>
  //               <td>{ 0 }</td>
  //             </tr>
  //           );
  //         })
  //       }
  //       </tbody>
  //     </table>

  //     <h3>Table Key</h3>
  //     <p>Stamps = 2 points (RA goal achieved in class)</p>
  //     <p>X = 1 point (RA goal not achieved, constructive conversation took place</p>
  //     <p>Blank = 0 points (no teacher/student conversation took place)</p>

  //     <p>Based on these points, { pointTracker.studentName } earned playing time amounting to { pointTracker.earnedPlayingTime } in the upcoming game. { pointTracker.mentorGrantedPlayingTime !== pointTracker.earnedPlayingTime ? `${pointTracker.studentName}'s mentor has selected playing time of ${pointTracker.mentorGrantedPlayingTime} however. "${pointTracker.synopsisComments.mentorGrantedPlayingTimeComments}"` : '' }</p>

  //     <h3>Student Action Items</h3>
  //     <p>{ pointTracker.synopsisComments.studentActionItems }</p>

  //     <h3>Sports Update</h3>
  //     <p>{ pointTracker.synopsisComments.sportsUpdate }</p>

  //     <p>Please feel free to respond to this message directly with any questions or concerns!</p>

  //     <p>{ pointTracker.synopsisComments.additionalComments }</p>

  //     <p>Best,</p>

  //     <p>RA {student.studentData.school.length > 0 ? studentsSchool.schoolName : null } Mentor</p>

  //   </div>
  // );
}

SynopsisReport.propTypes = {
  pointTracker: PropTypes.object,
  student: PropTypes.object,
};
