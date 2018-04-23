import React from 'react';
import Login from 'containers/Login';
import Logs from 'containers/Logs';

import store from './store';

import { Route, Redirect, } from 'react-router-dom';

const RouteWithSubRoutes = (routeProps) => {
  return (
    <Route
      exact
      path={routeProps.path}
      render={props => {
        const state = store.getState();
        if (routeProps.protected
          && state.user.loaded
          && !state.user.data) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }

        return <routeProps.component {...props} routes={routeProps.routes} />
      }}
    />
  )
};


export default state => [
  {
    path: '/',
    component: Logs,
    protected: true,
  },
  {
    path: '/login',
    component: Login,
    protected: false,
  },
].map((route, i) => <RouteWithSubRoutes key={i} state={state} {...route} />);
