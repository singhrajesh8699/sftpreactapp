// static imports
// import '../assets/css/main_app/core.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

// js
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './Containers/App'
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'typeface-roboto';

const rootEl = document.getElementById('app')

injectTapEventPlugin();

render(<App/>, rootEl)
