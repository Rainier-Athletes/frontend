
export const setError = error => ({
  type: 'ERROR_SET',
  payload: error,
});

export const clearError = () => ({
  type: 'ERROR_CLEAR',
});
