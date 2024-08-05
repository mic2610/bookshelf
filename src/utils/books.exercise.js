import {useQuery, queryCache} from 'react-query';
import {client} from 'utils/api-client';

const useBookSearch = (query, user) =>
  useQuery(getQuerySearchConfig(query, user));

const useBook = (bookId, user) =>
  useQuery(['book', {bookId}], () =>
    client(`books/${bookId}`, {token: user.token}),
  );

async function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch');
  await queryCache.prefetchQuery(getQuerySearchConfig('', user));
}

const getQuerySearchConfig = (query, user) => ({
  queryKey: ['bookSearch', query],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSuccess(books) {
      books.forEach(book => setQueryDataForBook(book));
    },
  },
});

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book);
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook};
