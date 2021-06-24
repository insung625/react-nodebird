import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import wrapper from '../store/configureStore';

// 공통적인 페이지를 적용할때 쓰는 컴포넌트
const App = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>Nodebird</title>
    </Head>
    <Component />
  </>
);

App.prototype = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
