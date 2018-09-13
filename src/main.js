import React from 'react';
import { render as renderDOM } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer/main';
import App from './components/app/app';

import './style/main.scss';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import thunk from './lib/middleware/redux-thunk';
// import reporter from './lib/middleware/redux-reporter';
// import session from './lib/middleware/redux-session';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
const root = document.createElement('div');
document.body.appendChild(root);

renderDOM(<Provider store={store}><App /></Provider>, root);
