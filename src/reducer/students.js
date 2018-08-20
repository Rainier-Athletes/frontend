export default (state = null, { type, payload }) => {
  switch (type) {
    case 'STUDENTS_SET':
      return payload;
    default:
      return state;
  }
};
