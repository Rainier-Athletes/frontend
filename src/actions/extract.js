import superagent from 'superagent';
import * as routes from '../lib/routes';

export const setCsvExtractLink = link => ({
  type: 'CSV_EXTRACT_LINK_SET',
  payload: link,
});

export const clearCsvExtractLink = () => ({
  type: 'CSV_EXTRACT_LINK_CLEAR',
});

// exportCommandString: [pointstracker | studentdata]?from=<date>&to=<date>
export const createCsvExtract = extractCommandString => (store) => {
  const { token } = store.getState();
  console.log('createCsvExport', extractCommandString);

  return superagent.get(`${API_URL}${routes.EXTRACT_CSV_ROUTE}/${extractCommandString}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      return store.dispatch(setCsvExtractLink(res.body.webViewLink));
    });
};
