import {server, rest} from 'test/server';
import {client} from '../api-client';
import {queryCache} from 'react-query';
import * as auth from 'auth-provider';

jest.mock('react-query');
jest.mock('auth-provider');

// beforeAll(() => server.listen());
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());

// 🐨 flesh these out:
const apiURL = process.env.REACT_APP_API_URL;

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint';
  const mockResult = {mockValue: 'VALUE'};
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult));
    }),
  );

  const result = await client(endpoint);
  expect(result).toEqual(mockResult);
});

test('adds auth token when a token is provided', async () => {
  // Arrange
  const token = 'FAKE_TOKEN';
  let request;
  const endpoint = 'test-endpoint';
  const mockResult = {mockValue: 'VALUE'};
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    }),
  );

  // Act
  await client(endpoint, {token});

  // Assert
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
});

test('allows for config overrides', async () => {
  // Arrange
  let request;
  const endpoint = 'test-endpoint';
  const mockResult = {mockValue: 'VALUE'};
  server.use(
    rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    }),
  );

  // Act
  const customConfig = {
    method: 'PUT',
  };
  await client(endpoint, customConfig);

  // Assert
  expect(request.method).toBe('PUT');
});

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  // Arrange
  const endpoint = 'test-endpoint';
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body));
    }),
  );

  // Act
  const data = {a: 'b'};
  const result = await client(endpoint, {data});

  // Assert
  expect(result).toEqual(data);
});

test('automatically logs the user out if a request returns a 401', async () => {
  const endpoint = 'test-endpoint';
  const mockResult = {mockValue: 'VALUE'};
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult));
    }),
  );

  const error = await client(endpoint).catch(e => e);

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`);

  expect(queryCache.clear).toHaveBeenCalledTimes(1);
  expect(auth.logout).toHaveBeenCalledTimes(1);
});

test('correctly rejects the promise if there is an error', async () => {
  const endpoint = 'test-endpoint';
  const testError = {message: 'Test error'};
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(testError));
    }),
  );

  await expect(client(endpoint)).rejects.toEqual(testError);
});
