/* @flow */

import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import request from '../../utils/request'
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAIL,
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  LOGIN,
} from './actions'

function* fetch ({ data, params = {}, }) {
  try {
    const { data } = yield call(request.get, '/users', { params, });
    yield put({ type: FETCH_SUCCESS, response: data, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: FETCH_FAIL, response: null, error: e.message });
  }
}

function* login ({ data }) {
  try {
    const { data: _data } = yield call(request.post, '/auth/login', data);
    request.token = _data.token; // adds token to local storage
    yield put({ type: FETCH_SUCCESS, response: _data.user, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: FETCH_FAIL, response: null, error: e.message });
  }
}

function* update ({ data }) {
  try {
    const res = yield call(request.put, '/users', data);
    yield put({ type: UPDATE_SUCCESS, response: res.data, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: UPDATE_FAIL, response: null, error: e.message });
  }
}


export default function* root () {
  yield all([
    takeLatest(FETCH, fetch),
    takeEvery(UPDATE, update),
    takeLatest(LOGIN, login),
  ]);
}
