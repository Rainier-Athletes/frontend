import moment from 'moment';

const renderIf = (test, trueComponent, falseComponent = null) => {
  return test ? trueComponent : falseComponent;
};

const devLogger = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    return console.log(...args); // eslint-disable-line
  }
  return null;
};

const cookieFetch = (key) => {
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

const cookieDelete = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const convertDateToValue = (inputDate) => {
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

const getReportingPeriods = () => {
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

const csvUpload = (fileUpload) => {
  // const fileUpload = document.getElementById('fileUpload'); 
  const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  
  if (regex.test(fileUpload.value.toLowerCase())) { 
    if (typeof (FileReader) !== 'undefined') { 
      const reader = new FileReader();
  
      reader.onload = (e) => {  
        const table = document.createElement('table');
  
        const rows = e.target.result.split('\n');
        
        for (let i = 0; i < rows.length; i++) {       
          const row = table.insertRow(-1);
          
          const cells = rows[i].split(',');
          
          for (let j = 0; j < cells.length; j++) {          
            const cell = row.insertCell(-1);
            
            cell.innerHTML = cells[j];   
          }  
        }
        const dvCSV = document.getElementById('dvCSV');

        dvCSV.innerHTML = '';

        dvCSV.appendChild(table);
      };  
      reader.readAsText(fileUpload.files[0]);
    } else {
      alert('This browser does not support HTML5.');
    }
  } else {
    alert('Please upload a valid CSV file.');
  }
}


export {
  renderIf,
  devLogger,
  cookieFetch,
  cookieDelete,
  convertDateToValue,
  getReportingPeriods,
};
