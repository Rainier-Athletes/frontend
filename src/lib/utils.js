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
  if (inputDate instanceof Date) {
    date = inputDate.toISOString();
  } else {
    date = inputDate;
  }
  
  if (!inputDate) return null; // handle null inputs

  // replacing '-' with '/' gets around the timezone issue that skews
  // dates by a day depending on the current time of day in your
  // current location.
  const dt = new Date(date.replace(/-/g, '/').replace(/T.+/, ''));
  const year = dt.getFullYear().toString();
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toLocalTime = (time = Date.now()) => {
  const d = new Date(time);
  const offset = (new Date().getTimezoneOffset() / 60) * -1;
  const n = new Date(d.getTime() + offset);
  console.log('toLocalTime offset, n', offset, n.toDateString());
  return n;
};

const getNextFridayDateString = (date) => {
  // find the friday following the given date
  let workingDate = date;
  // if (!(date instanceof Date)) workingDate = new Date(date);
  
  const day = workingDate.getDay();
  const today = workingDate.getDate();
  const delta = day > 5 ? 7 + 5 - day : 5 - day;
  workingDate.setDate(today + delta);

  return convertDateToValue(workingDate);
};

const getReportingPeriods = () => {
  debugger;
  let friday = moment().isoWeekday(5); // getNextFridayDateString(moment());
  friday = new Date(friday).setDate(new Date(friday).getDate() - 14);
  let monday = new Date(friday).setDate(new Date(friday).getDate() - 4);
  let sunday = new Date(friday).setDate(new Date(friday).getDate() + 2);
  monday = moment().isoWeekday(1).subtract(14, 'days');
  sunday = moment().isoWeekday(0).subtract(7, 'days');
  const reportingPeriods = [];

  for (let i = 0; i < 3; i++) {
    reportingPeriods.push(`${new Date(monday).toDateString()} to ${new Date(sunday).toDateString()}`);
    monday = new Date(monday).setDate(new Date(monday).getDate() + 7);
    sunday = new Date(sunday).setDate(new Date(sunday).getDate() + 7);
  }
  
  return reportingPeriods;
};

export { 
  renderIf, 
  devLogger, 
  cookieFetch, 
  cookieDelete,
  convertDateToValue,
  getNextFridayDateString,
  getReportingPeriods,
}; 
