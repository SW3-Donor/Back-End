import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Topbar extends Component {
  render() {
    return(
      <div>
        <div className="group">
          <div className="group-title">
            <div className="logo">DONOR</div>
          </div>
          <div className="group-nav">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <Link to="/board">게시판</Link>
              </li>
              <li>
                <Link to="/blood/trade">헌혈증 보내기</Link>
              </li>
              <li>
                <Link to="/blood/register">헌혈증 등록</Link>
              </li>
              <li>
                <Link to="/myinfo">마이페이지</Link>
              </li>
              <li>
                {this.props.token ? <a href="/logout" onClick={this.props.onLogout}>로그아웃</a>
                : <a href="/login">로그인</a>}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;