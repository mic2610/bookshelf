import {renderHook, act} from '@testing-library/react';
import {useAsync} from '../hooks';
import '@testing-library/jest-dom/extend-expect';

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

beforeEach(() => {
  jest.spyOn(console, 'error');
});

afterEach(() => {
  console.error.mockRestore();
});

const idleState = {
  status: 'idle',
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
};

const pendingState = {
  ...idleState,
  status: 'pending',
  isIdle: false,
  isLoading: true,
};

const resolvedState = {
  ...idleState,
  status: 'resolved',
  isIdle: false,
  isSuccess: true,
};

const rejectedState = {
  ...idleState,
  status: 'rejected',
  isIdle: false,
  isError: true,
};

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  const {promise, resolve} = deferred();

  // 🐨 use renderHook with useAsync to get the result
  const {result} = renderHook(() => useAsync());

  // 🐨 assert the result.current is the correct default state
  expect(result.current).toMatchObject(idleState);

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  // 🐨 assert that result.current is the correct pending state
  act(() => {
    result.current.run(promise);
  });

  expect(result.current).toMatchObject(pendingState);

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  // 🐨 assert the resolved state
  await act(async () => {
    await resolve();
  });

  expect(result.current).toMatchObject({
    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'resolved',
    data: undefined,
    run: expect.any(Function),
    reset: expect.any(Function),
  });

  // 🐨 call `reset` (💰 this will update state, so...)
  act(() => {
    result.current.reset();
  });
  // 🐨 assert the result.current has actually been reset

  console.log(result.current);

  expect(result.current).toMatchObject(idleState);
});

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred();
  const {result} = renderHook(() => useAsync());
  expect(result.current).toEqual(idleState);
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(pendingState);
  const rejectedValue = Symbol('rejected value');
  await act(async () => {
    reject(rejectedValue);
    await p.catch(() => {
      /* ignore erorr */
    });
  });
  expect(result.current).toEqual({
    ...rejectedState,
    error: rejectedValue,
  });
});
test('can specify an initial state', () => {
  const mockData = Symbol('resolved value');
  const customInitialState = {status: 'resolved', data: mockData};
  const {result} = renderHook(() => useAsync(customInitialState));
  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  });
});

test('can set the data', async () => {
  const mockData = Symbol('resolved value');
  const {result} = renderHook(() => useAsync());
  act(() => {
    result.current.setData(mockData);
  });

  expect(result.current.data).toBe(mockData);
});

test('can set the error', async () => {
  const mockData = Symbol('error value');
  const {result} = renderHook(() => useAsync());
  act(() => {
    result.current.setError(mockData);
  });

  expect(result.current.error).toBe(mockData);
});
// 💰 result.current.setError('whatever you want')

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred();
  const {result, unmount} = renderHook(() => useAsync());
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  unmount();
  await act(async () => {
    resolve();
    await p;
  });
  expect(console.error).not.toHaveBeenCalled();
});

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync());
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  );
});
