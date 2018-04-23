import { all, fork } from 'redux-saga/effects'
import { sagas as logs } from './logs'
import { sagas as user } from './user'

export default function* () {
  yield all([
    fork(user),
    fork(logs),
  ])
}
