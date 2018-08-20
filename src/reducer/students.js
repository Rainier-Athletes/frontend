export default (state = [], { type, payload }) => {
  switch (type) {
    case 'STUDENTS_SET':
      return payload;
    default:
      return state;
  }
};
