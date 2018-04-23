export const FETCH = 'logs/FETCH';
export const FETCH_SUCCESS = 'logs/FETCH_SUCCESS';
export const FETCH_FAIL = 'logs/FETCH_FAIL';

export const ADD = 'logs/ADD';
export const ADD_SUCCESS = 'logs/ADD_SUCCESS';
export const ADD_FAIL = 'logs/ADD_FAIL';

export const UPDATE = 'logs/UPDATE';
export const UPDATE_SUCCESS = 'logs/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'logs/UPDATE_FAIL';

export const DELETE = 'logs/DELETE';
export const DELETE_SUCCESS = 'logs/DELETE_SUCCESS';
export const DELETE_FAIL = 'logs/DELETE_FAIL';

export function fetch (params) {
  return { type: FETCH, params, }
}

export function add (data) {
  return { type: ADD, data, }
}

export function update (data) {
  return { type: UPDATE, data, }
}

export function remove (todo_id) {
  return { type: DELETE, todo_id, }
}
