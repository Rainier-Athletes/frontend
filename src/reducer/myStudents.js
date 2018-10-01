export default (state = null, { type, payload }) => {
  switch (type) {
    case 'MY_STUDENTS_SET':
      return payload;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
