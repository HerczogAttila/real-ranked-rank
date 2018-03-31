import { takeEvery, all } from 'redux-saga/effects';

import * as actionTypes from './rank';
import { getDataSaga } from './rank.saga';

export function* watch() {
  yield all([
    takeEvery(actionTypes.START_GET_DATA, getDataSaga)
  ]);
}
