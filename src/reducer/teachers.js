export default (state = [], { type, payload }) => {
  switch (type) {
    case 'TEACHERS_SET':
      return payload;
    default:
      return state;
  }
};
