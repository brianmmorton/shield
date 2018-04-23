/* @flow */

import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAIL,
  LOGIN,
  LOGIN_SUCCESS,
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
} from './actions';

export default (state = { loaded: false, loading: false, data: null, }, action) => {
  switch (action.type) {

    case FETCH:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: null,
        error: null,
      }

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.response,
        error: null,
      }

    case FETCH_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: null,
        error: action.error,
      }

    case LOGIN:
      return {
        ...state,
        saving: true,
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        saving: false,
        data: action.response,
      }

    case UPDATE:
      return {
        ...state,
        loading: false,
      }

    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
      }

    case UPDATE_FAIL:
      return {
        ...state,
        loading: false,
      }

    default:
      return state
  }
}
