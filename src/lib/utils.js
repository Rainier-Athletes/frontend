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

const convertDateToValue = (date) => {
  const dt = new Date(date);
  const year = dt.getFullYear().toString();
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const getNextFridayDateString = (date) => {
  // find the friday following the given date
  let workingDate = date;
  if (!(date instanceof Date)) workingDate = new Date(date);
  
  const day = workingDate.getDay();
  const today = workingDate.getDate();
  const delta = day > 5 ? 7 + 5 - day : 5 - day;
  workingDate.setDate(today + delta);

  return convertDateToValue(workingDate);
};

const getReportingPeriods = (date = Date.now()) => {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  let friday = new Date(`${getNextFridayDateString(date)} 00:00:00`);
  friday = new Date(friday).setDate(new Date(friday).getDate() - 14);
  let saturday = new Date(friday - (6 * oneDayInMs));
  const reportingPeriods = [];

  for (let i = 0; i < 3; i++) {
    reportingPeriods.push(`${new Date(saturday).toDateString()} to ${new Date(friday).toDateString()}`);
    saturday = new Date(saturday).setDate(new Date(saturday).getDate() + 7);
    friday = new Date(friday).setDate(new Date(friday).getDate() + 7);
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
