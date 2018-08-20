export default (state = null, { type, payload }) => {
  switch (type) {
    case 'TEACHERS_SET':
      return payload;
    default:
      return state;
  }
};
