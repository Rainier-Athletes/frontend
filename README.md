# RAINIER ATHLETES MENTOR PORTAL DEVELOPER DOCUMENTATION - FRONT-END SETUP
This project is currently in a public GitHub organization repo at https://github.com/Rainier-Athletes. The repo will be made private upon completion of the MVP.

## DESCRIPTION OF THE PROJECT
Rainier Athletes is a nonprofit organization located in Bellevue, WA. Their mission is to (add mission here). They have grown from 1 mentor with three children in 2006 to more than 40 mentors working with 80 young people in 2018. With the growth of the organization, there is a need for better tracking of data and ease of process for the mentors (who currently have multiple steps to submit a weekly synopsis report of the student's progress to the student's team of family, coach, teachers, and R/A administration).

Code Fellows Summer 401 Cohort was invited to take the current processes and implement a web-based portal to streamline the point tracking and synopsis report submission system for volunteer mentors. The portal also involves an administrative component to allow R/A admins to easily add new users to the system, and be able to track data in the newly created database. The cohort had, essentially, four business days to produce a functional app.


### CLIENT BRANDING
##### Logo
(Can I drop the variations in here?)

##### Typography
Rainier Athletes website currently uses Proxima Nova in a variety of font styles, and Adobe Garamond Pro. The client is interested in rebranding and the Admin/Mentor portal has been designed using the Google Font Raleway. To be added in future will be League Gothic (webfont will need to be purchased).

##### Colors
The primary colors in the current logo are: 
- $color-brand-blue: #1186B4;
- $color-brand-green: #0B9444;

The Portal utilizes two tints of each for button hover and focus features:
- $color-input-field: #59AACE;
- $color-input-focus: #A1CEE4;

- $color-button-green: #0B9444;
- $color-button-focus: #53B57D;


### HOW TO CONTRIBUTE
You'll need an account on github.com and an installation of node.js npm. Search Google for instructions on how to install these tools on your system.

Once you have the required prerequisites installed:

- Fork the frontend and backend repos at https://github.com/Rainier-Athletes. You will need both if you are making updates related to the state and database.
- Clone to your local machine (git clone)
- Install Node dependencies:
``` npm init y ```
``` npm i ```
- Work on a branch that is not **master** or **staging**; these are protected branches and will require administrative approval for any changes. 
- Submit a pull request back to the source repo. Include a complete description of your contributions. An administrator will review your code and either approve or request changes.
- If you have any questions, feel free to reach out to any one of the original team members.


### TECHNOLOGIES USED, FRONT-END:
- React/Redux
- NodeJS
- Webpack
- Superagent
- UUID
- Validator
- Font-Awesome
- Jest
- Cypress


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

### COLLABORATORS
This was the final project of the Code Fellows JS-401d25 cohort, August 2018. The code was developed by two teams, five persons each working on front-end and back-end code.

##### Front-end Team
- Noah Alexander
- Ashton Ellis
- Karen Lai
- Jennifer (Jenny) Lawrence
- Elizabeth (Liz) Petersen

##### Back-end Team
- Devin Cunningham
- Chris Hemenes
- Kevin Hwangpo
- Andrew Peacock
- Tracy Williams

### THANKS
Without the outreach of Rainier Athletes, this project would not have been in our hands. Thanks to Code Fellows (role?) Brian Nations and Instructor Judy Vue for believing in us and allowing us to partner with the client for a real-world final project. Thanks also to Teaching Assistants Noah Gribbin and Christina Thomas.
