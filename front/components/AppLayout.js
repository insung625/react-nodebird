import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

// 부분적으로 공통인것을 가지는 컴포넌트
// 반응형 그리드를 작성할때에는 모바일 -> 테블릿 -> 피씨순으로 개발을 해야한다.
// Row공간을 만들고 Col공간을 분활한다.
// Col은 합쳐서 24이하면 된다. 넘으면 다음줄로 내려간다.
// xs는 스마트폰 md 일반모니터사이즈

const Global = createGlobalStyle`
    .ant-row {
        margin-right: 0 !important;
        margin-left: 0  !important;
    }

    .ant-col:first-child {
        padding-left: 0 !important;
    }

    .ant-col:last-child {
        padding-right: 0 !important;
    }

`;

// const SearchInput = styled(Input.Search)`
//     vertical-align: middle;
// `;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput('');
  // 리덕스 사용
  const { me } = useSelector((state) => state.user);

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Menu mode="horizontal">
        <Global />
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm /> }
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://www.naver.com" target="_blank" rel="noreferrer noopener">NAVER</a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.proptype = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
