import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {

  input_check = (e) => {
    e.preventDefault();
    if (!e.target.id.value.trim()){
      alert('아이디를 입력하시오');
    }
    else if (!e.target.pw.value.trim()){
      alert('비밀번호를 입력하시오');
    }
    else{
      this.props.onLogin(e, {
        email: e.target.id.value,
        password: e.target.pw.value
      });
    }
  }

  render(){
    return(
      <div className='contents content_login'>
          <h2>로그인</h2>
        <div>
          <form onSubmit={this.input_check}>
            <div>
              <div>
                <input type='email' name='id' className='ps_box' placeholder='아이디(이메일)'></input>
              </div>
              <div>
                <input type='password' name='pw' className='ps_box' placeholder='비밀번호'></input>
              </div>
            </div>
            <div>
              <button type='submit' className='btn_type'>로그인</button>
            </div>
          </form>
          <div className='btnsub'>
            <Link to='/Join'>
              <button className="btn_sub">회원가입</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;