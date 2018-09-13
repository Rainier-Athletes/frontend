export default (state = null, { type, payload }) => {
  switch (type) {
    case 'RELATIONSHIP_SET':
      return payload;
    case 'RELATIONSHIP_DELETE':
      // const updatedProfiles = state.filter(profile => profile._id !== payload ); // eslint-disable-line
      return payload;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
