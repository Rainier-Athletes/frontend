export default store => next => (action) => {
  return typeof action === 'function' ? action(store) : next(action);
};
