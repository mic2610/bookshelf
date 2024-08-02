import {useQuery, useMutation, queryCache} from 'react-query';
import {client} from 'utils/api-client';

// const {data: listItems} = (user) => useQuery('list-items', () => client('list-items', {token: user.token}).then(data => data.listItems));
function UserListItems({user}) {
  const {data: listItems} = useQuery('list-items', () =>
    client('list-items', {token: user.token}).then(data => data.listItems),
  );

  return {listItems};
}

function useListItem({user, bookId}) {
  const {listItems} = UserListItems({user});
  return listItems?.find(li => li.bookId === bookId);
}

function useUpdateListItem() {
  return useMutation(
    ({updates, user}) =>
      client(`list-items/${updates.id}`, {
        data: updates,
        token: user.token,
        method: 'PUT',
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );
}

function useRemoveListItem(user) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );
}

const UserCreateListItem = user =>
  useMutation(
    ({bookId}) =>
      client('list-items', {data: {bookId}, token: user.token, method: 'POST'}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

export {
  UserListItems as userListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  UserCreateListItem as userCreateListItem,
};
