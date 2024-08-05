import {loadDevTools} from './dev-tools/load';
import './bootstrap';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
import {ReactQueryConfigProvider} from 'react-query';

// ignore the rootRef in this file. I'm just doing it here to make
// the tests I write to check your work easier.
export const rootRef = {};

const queryConfig = {
  queries: {
    useErrorBoundary: true,

    // Refetches the brower window for the app once you navigate back to it
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false;
      else if (failureCount < 2) return true;
      else return false;
    },
  },
};

loadDevTools(() => {
  // const root = createRoot(document.getElementById('root'))
  // root.render(<App />)
  // rootRef.current = root
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  );
});
