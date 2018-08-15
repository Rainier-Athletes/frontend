export default (state = null, { type, payload }) => {
  switch (type) {
    case 'POINT_TRACKER_SET':
      return payload;
    default:
      return state;
  }
};
