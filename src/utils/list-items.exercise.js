import {useQuery, useMutation, queryCache} from 'react-query';
import {client} from 'utils/api-client';
import {setQueryDataForBook} from './books.exercise';

// const {data: listItems} = (user) => useQuery('list-items', () => client('list-items', {token: user.token}).then(data => data.listItems));
function useListItems({user}) {
  const {data: listItems} = useQuery({
    queryKey: ['list-items'],
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess(listItems) {
        listItems.forEach(listItem => {
          setQueryDataForBook(listItem.book);
        });
      },
    },
  });

  return {listItems};
}

function useListItem({user, bookId}) {
  const {listItems} = useListItems({user});
  return listItems?.find(li => li.bookId === bookId);
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
};

function useUpdateListItem(user, ...options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items');

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item;
          });
        });

        return () => queryCache.setQueryData('list-items', previousItems);
      },
      ...defaultMutationOptions,
      ...options,
    },
  );
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData('list-items');

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id);
        });

        return () => queryCache.setQueryData('list-items', previousItems);
      },
      ...options,
      ...defaultMutationOptions,
    },
  );
}

const useCreateListItem = (user, mutationOptions) =>
  useMutation(
    ({bookId}) =>
      client('list-items', {data: {bookId}, token: user.token, method: 'POST'}),
    {...defaultMutationOptions, ...mutationOptions},
  );

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
