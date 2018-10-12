export default (state = null, { type, payload }) => {
  switch (type) {
    case 'ERROR_SET':
      return payload;
    case 'ERROR_CLEAR':
      return null;
    default:
      return state;
  }
};
