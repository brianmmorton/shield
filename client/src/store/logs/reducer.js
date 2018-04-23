/* @flow */

import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAIL,
  ADD,
  ADD_SUCCESS,
  ADD_FAIL,
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from './actions';

const initialState = {
  loaded: false,
  loading: false,
  saving: false,
  error: null,
  data: [],
}

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH:
      return {
        ...initialState,
        loading: true,
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.response,
      }

    case FETCH_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      }

    case ADD:
      return {
        ...state,
        saving: true,
      }

    case ADD_SUCCESS:
      return {
        ...state,
        saving: false,
        data: state.data.concat(action.log),
      }

    case ADD_FAIL:
      return {
        ...state,
        saving: false,
        error: action.error,
      }

    case UPDATE:
      return {
        ...state,
        saving: true,
      }

    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map(log => {
          if (log.id === action.log_id) {
            return {
              ...log,
              ...action.response,
            }
          }

          return log;
        }),
      }

    case UPDATE_FAIL:
      return {
        ...state,
        saving: false,
        error: action.error,
      }

    case DELETE:
      return {
        ...state,
        saving: true,
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        saving: false,
        data: state.data.filter(log => log.id !== action.log_id),
      }

    case DELETE_FAIL:
      return {
        ...state,
        saving: false,
        error: action.error,
      }

    default:
      return state
  }
}
