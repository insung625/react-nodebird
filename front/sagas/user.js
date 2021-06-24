import { all, put, fork, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
  LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  FOLLOW_REQUEST, FOLLOW_FAILURE, FOLLOW_SUCCESS,
  UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE,
  LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
  CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE,
  LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE,
  LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE,
} from '../reducers/user';

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* logIn(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    const result = yield call(logInAPI, action.data);
    // yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post('/user', data);
}

function* signUp(action) {
  try {
    // console.log(action.data);
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: SIGN_UP_FAILURE,
      // error: err.response.data,
    });
  }
}

// function logOutAPI() {
//   return axios.post('/user/logout');
// }

// function* logOut() {
//   try {
//     // call은 동기함수처럼 동작
//     // fork은 비동기함수로 동작
//     yield call(logOutAPI)
//     yield put({
//       type: LOG_OUT_SUCCESS,
//     });
//   } catch (err) {
//     // put은 dispatch와 동일한 기능을 한다.
//     yield put({
//       type: LOG_OUT_FAILURE,
//       error: err.response.data,
//     });
//   }
// }

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(loadUserAPI, action.data);
    // console.log(result);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    // yield delay(1000);
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    // yield delay(1000);
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch('/user/nickname', { nickname: data });
}

function* changeNickname(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(changeNicknameAPI, action.data);
    // console.log(result);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowersAPI(data) {
  return axios.get('/user/followers', data);
}

function* loadFollowers(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(loadFollowersAPI, action.data);
    // console.log(result);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get('/user/followings', data);
}

function* loadFollowings(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(loadFollowingsAPI, action.data);
    // console.log(result);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(removeFollowerAPI, action.data);
    // console.log(result);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI(data) {
  return axios.get('/user', data);
}

function* loadMyInfo(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(loadMyInfoAPI, action.data);
    // console.log(result);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// 이벤트 리스너 역할
function* watchLogIn() {
  // 매개변수로 전달된 여기서는 'LOG_IN_REQUEST' 액션이 들어올때 까지
  // 기다렸다가 logIn함수를 실행한다.
  // 아래 코드를 단독으로 사용하면 리스너로 기다리다가 한번만 실행하고 끝난다.
  // yield take('LOG_IN_REQUEST', logIn);
  // 아래 코드는 여러번 요청들어오는 것중 젤 마지막것만 서버로부터 받아서 실행한다.
  // yield takeEvery('LOG_IN_REQUEST', logIn);
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

export default function* userSaga() {
  yield all([
    fork(watchRemoveFollower),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadUser),
    fork(watchLoadMyInfo),
    fork(watchChangeNickname),
  ]);
}
