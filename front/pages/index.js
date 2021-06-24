import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  // eslint-disable-next-line max-len
  const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (retweetError) {
      return alert(retweetError);
    }
  }, [retweetError]);

  // 클라이언트 사이드 렌더링시에 사용
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_USER_REQUEST,
  //   })
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      console.log(window.scrollY, document.documentElement.clientHeight,
        document.documentElement.scrollHeight);
      if (Math.ceil(window.scrollY) + document.documentElement.clientHeight
        >= document.documentElement.scrollHeight - 1000) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      { me && <PostForm /> }
      { mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// 서버사이드 렌더링
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
