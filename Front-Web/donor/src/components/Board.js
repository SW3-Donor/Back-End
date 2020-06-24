import React, { Component } from 'react';
import BoardList from './BoardPages/BoardList';
import { Link } from 'react-router-dom';

class Board extends Component {
  constructor(){
    super()
    this.state = {
      data: []
    }
  }

  componentWillUnmount(){
    console.log("componentWillUnmount");
}

  componentDidMount(){
    this.boardHandler(this.props.data)
    .then(resData => {
      this.setState({
        data: resData.posts.reverse()
      })
    })
  }

  // 게시글 목록 가져오기
  boardHandler = (data) => {
    return fetch(`${data.url}/board/posts`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + data.token,
        "Content-Type": "application/json",
      }
    })
    .then(res => res.json())
  };

  getBoardList = (items) => {
    const boardList = items.map((item, index) => (
      <BoardList 
        id = {item._id}
        title = {item.title}
        received = {item.received}
        count = {item.count}
        name = {item.name}
        date = {item.updatedAt}
        num = {index + 1}
        key = {index + 1}
      />
    ))
    return boardList;
  }

  upScroll = () => {
    document.documentElement.scrollTop = 0;
  }

  render() {
    return(
      <div className="board_contents">
        <div className="board_title">
          <h1>당신의 참여로 희망을 만들어 주세요</h1>
        </div>
        <div className="board_btn">
          <div className="board_upload">
            <Link to='/board/write'>글쓰기</Link>
          </div>
          <div><button className="up_btn" onClick={this.upScroll}>위로가기</button></div>
        </div>
        <table className='table'>
          <thead>
            <tr align='center' className="tabel_title">
              <td width="70">번호</td>
              <td width="300">제목</td>
              <td width="100">수량</td>
              <td width="120">작성자</td>
              <td width="110">작성일</td>
            </tr>
          </thead>  
          <tbody>
            {this.getBoardList(this.state.data)}
          </tbody>
        </table>
        <br></br>
      </div>
    );
  }
}

export default Board;