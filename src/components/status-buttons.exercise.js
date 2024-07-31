/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import { useQuery, useMutation, queryCache } from 'react-query';
import { client } from 'utils/api-client';
import {useAsync} from 'utils/hooks'
import * as colors from 'styles/colors'
import {CircleButton, Spinner} from './lib'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({user, book}) {
  // 🐨 call useQuery here to get the listItem (if it exists)
  // queryKey should be 'list-items'
  // queryFn should call the list-items endpoint
  const {data: listItems} = useQuery('list-items', () => client('list-items', {token: user.token}).then(data => data.listItems));
  const listItem = listItems?.find(li => li.bookId === book.id);

  // const {data: listItems} = useQuery({
  //   queryKey: 'list-items',
  //   queryFn: () =>
  //     client(`list-items`, {token: user.token}).then(data => data.listItems),
  // })
  // const listItem = listItems?.find(li => li.bookId === book.id) ?? null
  

  // 🐨 call useMutation here and assign the mutate function to "update"
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.

  const Update = () => useMutation(
    updates => client(`list-items/${listItem.id}`, {data: updates, token: user.token, method: 'PUT'}),
    { onSettled: () => queryCache.invalidateQueries('list-items') }
  );

  // 🐨 call useMutation here and assign the mutate function to "remove"
  // the mutate function should call the list-items/:listItemId endpoint with a DELETE
  const Remove = () => useMutation(
    updates => client(`list-items/${listItem.id}`, {method: 'DELETE'}),
    { onSettled: () => queryCache.invalidateQueries('list-items') }
  );

  // 🐨 call useMutation here and assign the mutate function to "create"
  // the mutate function should call the list-items endpoint with a POST
  // and the bookId the listItem is being created for.
  const [create] = useMutation(
    ({bookId}) => client('list-items', {data: {bookId}, token: user.token, method: 'POST'}),
    { onSettled: () => queryCache.invalidateQueries('list-items') }
  );

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => Update({id: listItem.id, finishDate: null})}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => Update({id: listItem.id, finishDate: Date.now()})}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          // 🐨 add an onClick here that calls remove
          icon={<FaMinusCircle />}
          onClick={() => Remove({id: listItem.id})}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          // 🐨 add an onClick here that calls create
          onClick={() => create({bookId: book.id})}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
