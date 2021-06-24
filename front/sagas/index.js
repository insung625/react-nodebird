import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

// 디폴트 URL 설정
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true; // front에서도 back와 같이 credentials를 사용하려면 기입해줘야한다.

export default function* rootSaga() {
  //
  yield all([
    // fork는 매개변수로 전달된 함수를 비동기적으로 실행함을 선언
    fork(postSaga),
    fork(userSaga),
  ]);
}
