import styled from '@emotion/styled'
import {Dialog as ReachDialog} from '@reach/dialog'
import * as Colours from '../../src/styles/colors'
import * as MediaQueries from '../../src/styles/media-queries.js'
import {FaSpinner} from 'react-icons/fa';
import { keyframes } from '@emotion/core';

// Breaks the build
// import styled from '@emotion/styled/macro'


// Exercise 1
// const Button = styled.button(({variant = 'primary'}) => ({
//   padding: '10px 15px',
//   border: '0',
//   lineHeight: '1',
//   borderRadius: '3px',
//   background: (variant === 'primary') ? 'Colours.indigo' : Colours.gray,
//   color: (variant === 'primary') ? Colours.base : Colours.text,
// }));

// Extra Credit 1
const Button = styled.button(({
  padding: '10px 15px',
  border: '0',
  lineHeight: '1',
  borderRadius: '3px'
}), ({variant = 'primary'}) => ButtonVariants[variant]);

const ButtonVariants = {
  primary: {
    background: Colours.indigo,
    color: Colours.base,
  },
  secondary: {
    background: Colours.gray,
    color: Colours.text,
  },
}

const PrimaryButton = styled(Button)({
  background: Colours.indigo,
  color: Colours.base,
});

const SecondaryButton = styled(Button)({
  background: Colours.gray,
  color: Colours.text,
});


// Button variant="primary" (in addition to the above styles)
//   background: 'Colours.indigo',
//   color: Colours.base,

// Button variant="secondary" (in addition to the above styles)
//   background: Colours.gray,
//   color: Colours.text,

// FormGroup
//   display: 'flex',
//   flexDirection: 'column',

const Input = styled.input({
  borderRadius: '3px',
  border: `1px solid ${Colours.gray10}`,
  background: Colours.gray,
  padding: '8px 12px',
});

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

// 💰 I'm giving a few of these to you:
const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: Colours.base,
  color: Colours.text,
  border: `1px solid ${Colours.gray10}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [MediaQueries.small]: {
    width: '100%',
    margin: '10vh auto',
  },
});

const BookShelfContainerCss = styled.css=({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
});

const FormCss = styled.css=({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  '> div': {
    margin: '10px auto',
    width: '100%',
    maxWidth: '300px',
  }
});

// My own implementation
// const keyFrameSpin = keyframes`
//   @-ms-keyframes spin {
//     from { -ms-transform: rotate(0deg); }
//     to { -ms-transform: rotate(360deg); }
//   }
//   @-moz-keyframes spin {
//     from { -moz-transform: rotate(0deg); }
//     to { -moz-transform: rotate(360deg); }
//   }
//   @-webkit-keyframes spin {
//     from { -webkit-transform: rotate(0deg); }
//     to { -webkit-transform: rotate(360deg); }
//   }
//   from {
//     transform:rotate(0deg);
//   }
//   to {
//     transform:rotate(360deg);
//   }
//   `;

// const Spinner = styled(FaSpinner)({
//   animationName: keyFrameSpin,
//   animationDuration: '4000ms',
//   animationIterationCount: 'infinite',
//   animationTimingFunction: 'linear',
// });

// const spin = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
});

// For accessibility, we should always provide an aria-label for a spinner
Spinner.defaultProps = {
  'aria-label': 'loading',
};

export {CircleButton, Dialog, BookShelfContainerCss, Button, PrimaryButton, SecondaryButton, Input, FormGroup, FormCss, Spinner}
