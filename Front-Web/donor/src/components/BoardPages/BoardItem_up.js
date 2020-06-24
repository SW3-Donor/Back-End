import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BoardItem_up extends Component {
  constructor(){
    super()
    this.state = {title: null, count: null, content: null}
    this.inputForHandler = this.inputForHandler.bind(this);
  }

  // 게시판 id, 토큰, 몇개
  componentDidMount(){
    this.boardItemHandler(this.props.data, this.props.match.params.id)
    .then(resData => {
      this.setState({
        postId: resData.post._id,
        title: resData.post.title,
        count: resData.post.count,
        received: resData.post.received,
        content: resData.post.content,
        name: resData.post.name
      })
    })
  }

  inputForHandler(e){
    this.setState({[e.target.name]:e.target.value});
  }

  boardItemHandler = (data, postId) => {
    return fetch(`${data.url}/board/post${postId}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + data.token,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
  }

  input_check = (e) => {
    e.preventDefault();
    if (!this.props.data.token){
      alert('로그인을 먼저하시오');
    }
    else if (!e.target.title.value.trim()){
      alert('제목을 입력하시오');
    }
    else if (!e.target.count.value.trim()){
      alert('수량을 입력하시오');
    }
    else if (!e.target.content.value.trim()){
      alert('내용을 입력하시오');
    }
    else {
      this.updateHandler(e, this.props.data)
    }
  }

  updateHandler = (event, data) => {
    event.preventDefault();
    fetch(`${data.url}/board/post${this.state.postId}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + data.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: this.state.title,
        content: this.state.content,
        count: this.state.count
      }),
    })
      .then(res => res.json())
      .then(resData => {
        if(resData.message === '게시글 수정 완료 하였습니다.'){
          alert('게시글 수정이 완료 되었습니다.')
          this.setState({
            success: true
          })
        } else {
          alert('게시글 수정 실패')
        }
      })
  }

  render(){
    return(
      <div className="board_contents">
        <form onSubmit={this.input_check}>
          <table className='table write_table'>
            <caption>게시글 수정</caption>
            <tbody>
              <tr>
                <td className='write_td'>제 목</td>
                <td><input type='text' className="input_box" name="title" value={this.state.title} onChange={this.inputForHandler}/></td>
              </tr>
              <tr>
                <td className='write_td'>작성자</td>
                <td>{this.state.name}</td>
              </tr>
              <tr>
                <td className='write_td'>수 량</td>
                <td>{this.state.received} / <input type='number' name="count" className="input_box" min='0' value={this.state.count} onChange={this.inputForHandler}/></td>
              </tr>
              <tr>
                <td className='write_td'>내 용</td>
                <td><textarea rows="10" cols="100" name="content" className="textarea_box" value={this.state.content} onChange={this.inputForHandler}/></td>
              </tr>
            </tbody>
          </table>
          <div className="write_btn_s">
            <input type="submit" className="up_btn view_btn" value="저장" />
            <Link to={`/board/list/${this.state.postId}`}><input type="button" className="up_btn view_btn" value="뒤로" /></Link>
          </div>
        </form>
      </div>
    );
  }
}

export default BoardItem_up;