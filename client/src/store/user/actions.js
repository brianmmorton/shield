export const FETCH = 'user/FETCH';
export const FETCH_SUCCESS = 'user/FETCH_SUCCESS';
export const FETCH_FAIL = 'user/FETCH_FAIL';

export const ADD = 'user/ADD';
export const ADD_SUCCESS = 'user/ADD_SUCCESS';
export const ADD_FAIL = 'user/ADD_FAIL';

export const UPDATE = 'user/UPDATE';
export const UPDATE_SUCCESS = 'user/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'user/UPDATE_FAIL';

export const DELETE = 'user/DELETE';
export const DELETE_SUCCESS = 'user/DELETE_SUCCESS';
export const DELETE_FAIL = 'user/DELETE_FAIL';

export const LOGIN = 'user/LOGIN';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'user/LOGIN_FAIL';

export function fetch (params) {
  return { type: FETCH, params, }
}

export function add (data) {
  return { type: ADD, data, }
}

export function update (data) {
  return { type: UPDATE, data, }
}

export function remove () {
  return { type: DELETE, }
}

export function login (data) {
  return { type: LOGIN, data, }
}
