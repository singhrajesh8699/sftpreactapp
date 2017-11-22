// css imports
// import '../assets/css/main_app/main.css';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

// js
import "babel-polyfill"
import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'typeface-roboto';
import App from './Containers/App';

const rootEl = document.getElementById('app');

const renderApp = () => {
  render((
    <AppContainer>
      <App/>
    </AppContainer>
  ), rootEl);
}

if (module.hot) {
    module.hot.accept('./Containers/App', () => {
     renderApp();
  });
}

injectTapEventPlugin();

renderApp();
