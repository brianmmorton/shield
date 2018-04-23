/* @flow */

import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import request from '../../utils/request'
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAIL,
  ADD,
  ADD_SUCCESS,
  ADD_FAIL,
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAIL,
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
} from './actions'

function* fetch ({ params = {}, }) {
  try {
    const { data } = yield call(request.get, '/logs', { params, });
    yield put({ type: FETCH_SUCCESS, response: data, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: FETCH_FAIL, response: null, error: e.message });
  }
}

function* add ({ data }) {
  try {
    const res = yield call(request.post, `/logs`, data);
    yield put({ type: ADD_SUCCESS, response: res.data, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: ADD_FAIL, response: null, error: e.message });
  }
}

function* update ({ data }) {
  try {
    const res = yield call(request.put, '/logs', data);
    yield put({ type: UPDATE_SUCCESS, response: res.data, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: UPDATE_FAIL, response: null, error: e.message });
  }
}

function* remove ({ log_id }) {
  try {
    const res = yield call(request.delete, `/logs/${log_id}`);
    yield put({ type: DELETE_SUCCESS, response: res.data, log_id, });
  }
  catch (e) {
    console.log(e);
    yield put({ type: DELETE_FAIL, response: null, error: e.message });
  }
}


export default function* root () {
  yield all([
    takeLatest(FETCH, fetch),
    takeEvery(ADD, add),
    takeEvery(UPDATE, update),
    takeEvery(DELETE, remove),
  ]);
}
