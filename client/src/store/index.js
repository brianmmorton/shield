/* @flow */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as reducers from './reducers'

import sagas from './sagas'
const sagaMiddleware = createSagaMiddleware()

const enhancer = compose(applyMiddleware(sagaMiddleware))

function configureStore (initialState) {

  const store = createStore(
    combineReducers({ ...reducers }),
    initialState,
    enhancer
  )

  sagaMiddleware.run(sagas)

  return store
}

const store = configureStore();

export default store;
