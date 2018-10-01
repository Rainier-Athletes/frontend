export default (state = [], { type, payload }) => {
  switch (type) {
    case 'POINT_TRACKERS_SET':
      return payload;
    default:
      return state;
  }
};
