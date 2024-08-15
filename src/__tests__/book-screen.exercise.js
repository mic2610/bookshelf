import * as React from 'react';
import {screen} from '@testing-library/react';
import {buildBook, buildListItem} from 'test/generate';
import {formatDate} from 'utils/misc';
import {App} from 'app';
import {
  render,
  userEvent,
  loginAsUser,
  waitForLoadingToFinish,
} from 'test/app-test-utils';
import * as booksDB from 'test/data/books';
import * as listItemsDB from 'test/data/list-items';
import faker from 'faker';

const fakeTimerUserEvent = userEvent.setup({
  advanceTimers: () => jest.runOnlyPendingTimers(),
});

async function renderBookScreen({user, book, listItem} = {}) {
  if (user === undefined) user = await loginAsUser();

  if (book === undefined) book = await booksDB.create(buildBook());

  if (listItem === undefined)
    listItem = await listItemsDB.create(buildListItem({owner: user, book}));

  const route = `/book/${book.id}`;
  const utils = await render(<App />, {route, user});
  return {...utils, user, book, listItem};
}

test('renders all the book information', async () => {
  const {book} = await renderBookScreen({listItem: null});
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument();
  expect(screen.getByText(book.author)).toBeInTheDocument();
  expect(screen.getByText(book.publisher)).toBeInTheDocument();
  expect(screen.getByText(book.synopsis)).toBeInTheDocument();
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  );
  expect(
    screen.getByRole('button', {name: /add to list/i}),
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument();
});

test('can create a list item for the book', async () => {
  const {book} = await renderBookScreen({listItem: null});

  const addToListButton = screen.getByRole('button', {name: /add to list/i});
  await userEvent.click(addToListButton);
  expect(addToListButton).toBeDisabled();

  await waitForLoadingToFinish();

  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument();

  const startDateNode = screen.getByLabelText(/start date/i);
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()));

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument();
});

test('can remove a list item for the book', async () => {
  await renderBookScreen();

  const addToListButton = screen.getByRole('button', {
    name: /remove from list/i,
  });
  await userEvent.click(addToListButton);
  expect(addToListButton).toBeDisabled();

  await waitForLoadingToFinish();

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument();
});

test('can mark a list item as read', async () => {
  const {listItem} = await renderBookScreen();
  await listItemsDB.update(listItem.id, {finishDate: null});
  const markAsReadButton = screen.getByRole('button', {name: /mark as read/i});
  await userEvent.click(markAsReadButton);
  expect(markAsReadButton).toBeDisabled();

  await waitForLoadingToFinish();

  expect(
    screen.getByRole('button', {name: /mark as unread/i}),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('radio', {name: /star/i})).toHaveLength(5);

  const startAndFinishDateNode = screen.getByLabelText(
    /start and finish date/i,
  );
  expect(startAndFinishDateNode).toHaveTextContent(
    `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
  );

  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument();
});

test('can edit a note', async () => {
  // using fake timers to skip debounce time
  jest.useFakeTimers();
  const {listItem} = await renderBookScreen();

  const newNotes = faker.lorem.words();
  const notesTextarea = screen.getByRole('textbox', {name: /notes/i});

  await fakeTimerUserEvent.clear(notesTextarea);
  await fakeTimerUserEvent.type(notesTextarea, newNotes);

  // wait for the loading spinner to show up
  await screen.findByLabelText(/loading/i);
  // wait for the loading spinner to go away
  await waitForLoadingToFinish();

  expect(notesTextarea).toHaveValue(newNotes);

  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes: newNotes,
  });
});

describe('console errors', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('shows an error message when the book fauls to load', async () => {
    const book = {id: 'fake-book-id'};
    await renderBookScreen({listItem: null, book});

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"There was an error: Book not found"`);
  });
});
