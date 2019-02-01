export default (state = null, { type, payload }) => {
  let updatedProfiles;
  switch (type) {
    case 'PROFILE_SET':
      return payload;
    case 'PROFILE_DELETE':
      updatedProfiles = state.filter(profile => profile._id !== payload._id); 
      return updatedProfiles;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
