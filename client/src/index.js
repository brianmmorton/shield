import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import 'styles';

import createRoutes from './routes';
import App from 'containers/App';
import registerServiceWorker from './registerServiceWorker';

import store from './store';

const state = store.getState();
const routes = createRoutes(state);

ReactDOM.render(
  <Provider store={store}>
    <App routes={routes} />
  </Provider>
, document.getElementById('root'));

registerServiceWorker();
