import React, { Component } from 'react';

class SecondPw extends Component {

  input_check = (e) => {
    e.preventDefault();
    if (!e.target.pw1.value.trim()){
      alert('비밀번호를 입력하시오');
    }
    else if (e.target.pw2.value.trim() !== e.target.pw1.value.trim()){
      alert('비밀번호가 일치하지 않습니다');
    }
    else {
      this.props.secondPassword(e, { password: e.target.pw1.value, userId: this.props.userId });
    }
  }

  render(){
    return(
      <div className="contents">
        <br />
        <div className='blood_title'>2차 비밀번호</div>
        <br />
        <form
          onSubmit={this.input_check}>
          <div>
            <div>
              <input type='password' name='pw1' className='ps_box' placeholder='2차 비밀번호'></input>
            </div>
            <div>
              <input type='password' name='pw2' className='ps_box' placeholder='2차 비밀번호 확인'></input>
            </div>   
            <div>
              <button type='submit' className='btn_type'>2차 비밀번호 설정</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SecondPw;
