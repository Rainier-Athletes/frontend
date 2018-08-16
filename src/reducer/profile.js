export default (state = null, { type, payload }) => {
  switch (type) {
    case 'PROFILE_SET':
      return payload;
    case 'PROFILE_DELETE':
      console.log(state[0]);
      console.log(payload);// eslint-disable-line
      const updatedProfiles = state.filter(profile => profile._id !== payload._id ); // eslint-disable-line
      return updatedProfiles;
    case 'TOKEN_REMOVE':
      return null;
    default:
      return state;
  }
};
