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

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  const {promise, resolve} = deferred();

  // 🐨 use renderHook with useAsync to get the result
  const {result} = renderHook(() => useAsync());

  // 🐨 assert the result.current is the correct default state
  expect(result.current).toMatchObject({
    status: 'idle',
    data: null,
    error: null,
  });

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  // 🐨 assert that result.current is the correct pending state
  act(() => {
    result.current.run(promise);
  });

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  // 🐨 assert the resolved state
  await act(async () => {
    await resolve();
  });

  expect(result.current).toMatchObject({
    status: 'resolved',
    data: null,
    error: null,
  });

  // 🐨 call `reset` (💰 this will update state, so...)
  act(() => {
    result.current.reset();
  });
  // 🐨 assert the result.current has actually been reset

  expect(result.current).toMatchObject({
    status: 'idle',
    data: null,
    error: null,
  });
});

test.todo('calling run with a promise which rejects');
// 🐨 this will be very similar to the previous test, except you'll reject the
// promise instead and assert on the error state.
// 💰 to avoid the promise actually failing your test, you can catch
//    the promise returned from `run` with `.catch(() => {})`

test.todo('can specify an initial state');
// 💰 useAsync(customInitialState)

test.todo('can set the data');
// 💰 result.current.setData('whatever you want')

test.todo('can set the error');
// 💰 result.current.setError('whatever you want')

test.todo(
  'No state updates happen if the component is unmounted while pending',
);
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error');
