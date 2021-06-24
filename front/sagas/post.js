import { put, takeLatest, fork, all, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
  LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_TO_ME } from '../reducers/user';

function likePostAPI(data) {
  // 여기서 data는 post.id다
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    // yield delay(1000);
    const result = yield call(likePostAPI, action.data);
    // const id = shortId.generate();
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    // put은 dispatch와 동일한 기능을 한다.
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  // 여기서 data는 post.id다
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    // yield delay(1000);
    const result = yield call(unlikePostAPI, action.data);
    // const id = shortId.generate();
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/post', data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    // const id = shortId.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  // 중간에 게시글 아이디 들어감, 주소는 약속임으로 아무렇게 넣어줘도 되나, 의미를 주기위해 하기와 같이 작성함
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    // console.log(action);
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    // yield delay(1000);
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,

    });
    yield put({
      type: REMOVE_POST_TO_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get(`/posts?lastId=${data || 0}`);
}

function* loadPosts(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,

    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function* uploadImages(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(uploadImagesAPI, action.data);
    // console.log(result);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`, data);
}

function* retweet(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(retweetAPI, action.data);
    // console.log(result);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    // yield delay(1000);
    // console.log(action.data);
    const result = yield call(loadPostAPI, action.data);
    // console.log(result);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    // 400번대, 500번대 응답이 오면 여기로 옴
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,

    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  console.log(data);
  console.log(lastId);
  return axios.get(`/hashtag/${encodeURIComponent(data)}/posts?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
  try {
    // call은 동기함수처럼 동작
    // fork은 비동기함수로 동작
    // put은 dispatch동작과 같다
    console.log(action);
    console.log(action.data);
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    // put은 dispatch와 동일한 기능을 한다.
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

//= =====이벤트 리스너같은 역할을 한다=========
function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadPost() {
  yield throttle(5000, LOAD_POST_REQUEST, loadPost);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPosts),
    fork(watchLoadPost),
  ]);
}
