import React, { Component } from 'react';

class Blood extends Component {
  input_check = (e) => {
    e.preventDefault();
    if (!this.props.token) {
      alert('로그인을 먼저 하십시오.')
    }
    else if (!e.target.blood_register.value.trim()){
      alert('헌혈증 번호를 입력하시오');
    }
    else if(!e.target.pw2.value.trim()){
      alert('2차비밀번호를 입력하시오')
    }
    else{
      this.props.onBlood(e, {
        number: e.target.blood_register.value,
        password: e.target.pw2.value
      });
    }
  }

  render() {
    return(
      <div className='contents'>
        <br />
        <div className='blood_title'>헌혈증 등록</div>
        <br />
        <form onSubmit={this.input_check}>
          <div>
            <input type='number' name='blood_register' className='ps_box' placeholder='헌혈증 번호' min='0' />
          </div>
          <div>
            <input type='password' name='pw2' className='ps_box' placeholder='2차비번'></input>
          </div>
          <div>
            <button type='submit' className='btn_type'>등록</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Blood;