/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import * as auth from 'auth-provider'
import {client} from './utils/api-client';
import {useAsync} from './utils/hooks';
import * as colors from './styles/colors';
import { FullPageSpinner } from './components/lib';

async function getUser() {
  let user = null;
  const token = await auth.getToken();
  if (token)
  {
    var response = await client('me', {token});
    user = response.user;
  }
    

  return user;
}

function App() {
  // 🐨 useState for the user
  const {
    data,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    // getUser().then(u => setData(u));
    run(getUser());
  }, [run]);

  if (isIdle || isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    );
  }
  
  // const doSomething = () => somethingAsync().then(data => setData(data))
  
  // You'll use this for the `login` and `register`.

  // 🐨 create a login function that calls auth.login then sets the user
  const login = form => auth.login(form).then(u => setData(u));

  // 🐨 create a registration function that does the same as login except for register
  const register = form => auth.register(form).then(u => setData(u));

  // 🐨 create a logout function that calls auth.logout() and sets the user to null
  const logout = () => auth.logout().then(() => setData(null));

  // 🐨 if there's a user, then render the AuthenticatedApp with the user and logout
  if (data) {
    return <AuthenticatedApp user={data} logout={logout} />
  }
  else {
    return <UnauthenticatedApp login={login} register={register} />
  }

}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
