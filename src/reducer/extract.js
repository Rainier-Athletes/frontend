export default (state = null, { type, payload }) => {
  switch (type) {
    case 'CSV_EXTRACT_LINK_SET':
      return payload;
    case 'CSV_EXTRACT_LINK_CLEAR':
      return null;
    default:
      return state;
  }
};
