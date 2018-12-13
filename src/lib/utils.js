import moment from 'moment';

export const renderIf = (test, trueComponent, falseComponent = null) => {
  return test ? trueComponent : falseComponent;
};

export const devLogger = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    return console.log(...args); // eslint-disable-line
  }
  return null;
};

export const cookieFetch = (key) => {
  const cookies = document.cookie
    .split(';')
    .map(str => str.split('='))
    .reduce((acc, cur) => {
      const cookieKey = cur[0].trim();
      const cookieVal = cur[1];

      acc[cookieKey] = cookieVal;
      return acc;
    }, {});
  return cookies[key];
};

export const cookieDelete = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const convertDateToValue = (inputDate) => {
  let date;
  const dateFormat = 'YYYY[-]MM[-]DD';

  if (!inputDate) return null;

  if (inputDate instanceof Date) {
    date = inputDate.toISOString();
  } else {
    date = inputDate;
  }

  const dateOnly = date.replace(/T.+/, ''); // strip off time portion

  date = moment(dateOnly);

  const formattedDate = date.format(dateFormat);

  return formattedDate;
};

export const getReportingPeriods = () => {
  let monday = moment().isoWeekday(1).subtract(14, 'days');
  let sunday = moment().isoWeekday(0).subtract(7, 'days');

  const reportingPeriods = [];
  const dateFormat = 'YYYY[-]MM[-]DD';
  for (let i = 0; i < 3; i++) {
    reportingPeriods.push(`${monday.format(dateFormat)} to ${sunday.format(dateFormat)}`);
    monday = monday.add(7, 'days');
    sunday = sunday.add(7, 'days');
  }

  return reportingPeriods;
};

const importProfiles = (profiles) => {
  console.log('importing', profiles.length, 'profiles');
};

const importConnections = (connections) => {
  console.log('importing', connections.length, 'connections');  
};

export const csvUpload = (fileType, fileUpload) => { 
  const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

  if (regex.test(fileUpload.name.toLowerCase())) { 
    if (typeof (FileReader) !== 'undefined') { 
      const reader = new FileReader();
  
      reader.onload = (e) => { 
        const rows = e.target.result.split('\n');
        const headerLabels = rows[0].split(',');
        const data = [];
        for (let i = 1; i < rows.length; i++) {                
          const cells = rows[i].split(','); 
          const rowObj = {};        
          for (let j = 0; j < cells.length; j++) {          
            rowObj[headerLabels[j]] = cells[j];
          }
          data.push(rowObj);
        }
        if (fileType === 'profiles') return importProfiles(data);
        if (fileType === 'connections') return importConnections(data);
      };  
      reader.readAsText(fileUpload);
    } else {
      alert('This browser does not support HTML5.');
    }
  } else {
    alert('Please upload a valid CSV file.');
  }
};
