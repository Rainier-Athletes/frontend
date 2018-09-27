export default (state = null, { type, payload }) => {
  switch (type) {
    case 'STUDENT_DATA_SET':
      return payload;
    case 'STUDENT_DATA_BULK_SET':
      return payload;
    default:
      return state;
  }
};
