export default (state = null, { type, payload }) => {
  switch (type) {
    case 'PROFILE_SET':
      return payload;
    case 'PROFILE_DELETE':
      console.log(state);
      console.log(payload);
      const updatedProfiles = state.filter(profile => profile._id !== payload ); // eslint-disable-line
      return updatedProfiles;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
