import {useQuery} from 'react-query';
import {client} from 'utils/api-client';

const useBookSearch = ({query, user}) =>
  useQuery(['bookSearch', {query}], () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  );

export {useBookSearch};
