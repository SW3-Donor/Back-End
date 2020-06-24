import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BoardWrite extends Component {

  input_check = (e) => {
    e.preventDefault();
    if (!this.props.token){
      alert('아이디를 입력하시오');
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
      this.props.onBoardWrite(e, {
        title: e.target.title.value,
        content: e.target.content.value,
        count: e.target.count.value
      });
    }
  }

  render(){
    return(
      <div className="board_contents">
        <form onSubmit={this.input_check}>
          <table className='table write_table'>
            <caption>게시글 쓰기</caption>
            <br />
            <tbody>
              <tr>
                <td className='write_td'>제 목</td>
                <td><input type='text' className="input_box" name="title" placeholder="제목" /></td>
              </tr>
              <tr>
                <td className='write_td'>수 량</td>
                <td><input type='number' className="input_box" name="count" min='0' placeholder='0'/></td>
              </tr>
              <tr>
                <td className='write_td'>내 용</td>
                <td><textarea rows="10" className="textarea_box" cols="100" name="content" placeholder="내용"/></td>
              </tr>
            </tbody>
          </table>
          
          <div className="write_btn_s">
            <input type="submit" className="up_btn view_btn" value="등록" />
            <Link to="/board"><input type="button" className="up_btn view_btn" value="뒤로" /></Link>
          </div>
        </form>
      </div>
    );
  }
}

export default BoardWrite;