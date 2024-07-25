// 🐨 you'll need to import react and createRoot from react-dom up here
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import {Logo} from './components/logo';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

function LoginForm({onSubmit, buttonText}) {
    function handleSubmit(event) {
        event.preventDefault();
        const {username, password} = event.target.elements;
        onSubmit({
            username: username.value,
            password: password.value
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" />
            </div>
            <div>
                <button type="submit">{buttonText}</button>
            </div>
        </form>
    );
}

function App() {
    const [showDialog, setShowDialog] = React.useState('');
    const openLogin = () => setShowDialog('login');
    const openRegister = () => setShowDialog('register');
    const close = () => setShowDialog('');
    return (
        <div>
            <Logo />
            <h1>Bookshelf</h1>
            <button onClick={openLogin}>Login</button>
            <button onClick={openRegister}>Register</button>

            <Dialog aria-label='Login' isOpen={showDialog === 'login'} onDismiss={close}>
                <LoginForm onSubmit={values => console.log('login', values)} buttonText='Login' />
                <button onClick={close}>Close</button>
            </Dialog>
            <Dialog aria-label='Register' isOpen={showDialog === 'register'} onDismiss={close}>
                <LoginForm onSubmit={values => console.log('register', values)} buttonText='Register' />
                <button onClick={close}>Close</button>
            </Dialog>
        </div>
    );
}

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

createRoot(document.getElementById('root')).render(<App />);

// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
