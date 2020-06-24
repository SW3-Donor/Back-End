import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Join extends Component {

  input_check = (e) => {
    e.preventDefault();
    if (!e.target.id.value.trim()){
      alert('아이디를 입력하시오');
    }
    else if (!e.target.name.value.trim()){
      alert('이름을 입력하시오');
    }
    else if (!e.target.phone.value.trim()){
      alert('전화번호를 입력하시오');
    }
    else if (!e.target.pw1.value.trim()){
      alert('비밀번호를 입력하시오');
    }
    else if (e.target.pw2.value.trim() !== e.target.pw1.value.trim()){
      alert('비밀번호가 일치하지 않습니다');
    }
    else {
      this.props.onSignup(e, {
        email: e.target.id.value,
        name: e.target.name.value,
        phone: e.target.phone.value,
        password: e.target.pw1.value
      });
    }
  }

  render(){
    return(
      <div className='contents'>
        <div>
          <h2>회원가입</h2>
        </div>
        <form
          onSubmit={this.input_check}
         >
          <div>
            <div>
            <input type='email' name='id' className='ps_box' placeholder='아이디(이메일)'></input>
            </div>
            <div>
            <input type='text' name='name' className='ps_box' placeholder='이름'></input>
            </div>
            <div>
              <input type='tel' name='phone' className='ps_box' placeholder='전화번호'></input>
            </div>
            <div>
              <input type='password' name='pw1' className='ps_box' placeholder='비밀번호'></input>
            </div>
            <div>
              <input type='password' name='pw2' className='ps_box' placeholder='비밀번호 확인'></input>
            </div>   
            <div>
              <button type='submit' className='btn_type'>회원가입</button>
            </div>
          </div>
        </form>
        <div className='btnsub'>
            <Link to='/login'>
              <button className="btn_sub">로그인</button>
            </Link>
          </div>
      </div>
    );
  }
}

export default Join;
