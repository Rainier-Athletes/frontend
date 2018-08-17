# RAINIER ATHLETES MENTOR PORTAL DOCUMENTATION - FRONT-END SETUP
This project is in a public GitHub organization repo at https://github.com/Rainier-Athletes. 

### HOW TO CONTINUE THE WORK...
You'll need an account on github.com and an installation of node.js npm. Search Google for instructions on how to install these tools on your system.

Once you have the required prerequisites installed:

- Fork the frontend and backend repos at https://github.com/Rainier-Athletes. You will need both if you are making updates related to the state and database.
- Clone to your local machine (git clone)
- Do your work
- Submit a pull request back to the source repo. Include a complete description of your contributions.

If you have any questions, feel free to reach out to any one of the original team members.

### 

### COLLABORATORS
This was the final project of the Code Fellows JS-401d25 cohort, August 2018. The code was developed by two teams, working on the frontend and backend code.


### NOTE TO SELF :
Client is interested in switching fonts to 
Raleway
<link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,500,500i,600,600i,700,900" rel="stylesheet">
font-family: 'Raleway', sans-serif;

##Don't delete me
"heroku-postbuild": "webpack --progress --config webpack.prod.js"

## Mock Point Tracker Data
```
const mockPointTrackerData = {
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
```
