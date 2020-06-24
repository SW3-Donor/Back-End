import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ModalPages from '../components/myinfoPages/modalPages';
import BloodList from './myinfoPages/BloodList';
import SendList from './myinfoPages/SendList';
import ReceiveList from './myinfoPages/ReceiveList';

class MyInfo extends Component {
  constructor(){
    super()
    this.state = {
      count: 0,
      email: null,
      myblood: [],
      name: null,
      phone: null,
      receivetrade: [],
      sendtrade: [],
      isModalOpen: false,
      content: []
    }
  }
  componentDidMount(){
    this.myinfoHandler(this.props.data)
    .then(resData => {
      this.setState({
        count: resData.count,
        email: resData.email,
        myblood: resData.myblood.reverse(),
        name: resData.name,
        phone: resData.phone,
        receivetrade: resData.receivetrade.reverse(),
        sendtrade: resData.sendtrade.reverse()
      })
    })
  }

  // 유저 정보 api
  myinfoHandler = (data) => {
    return fetch(`${data.url}/profile/user`, {
      method: "post",
      headers: {
        Authorization: "Bearer " + data.token,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
  };

  getBlood = (items) => {
    const bloodlist = items.map((item, index) => (
      <BloodList
        date = {item.updatedAt}
        number = {item.validnumber}
        key = {index + 1}
      />
    ))
    return bloodlist;
  }

  getSendList = (items) => {
    const sendlist = items.map((item, index) => {
      return <SendList
        receiver = {item.receiver}
        date = {item.createdAt}
        key = {index + 1}
      />
    })
    return sendlist;
  }

  getReceiveList = (items) => {
    const receivelist = items.map((item, index) => {
      return <ReceiveList
        sender = {item.sender}
        date = {item.createdAt}
        key = {index + 1}
      />
    })
    return receivelist;
  }

  // modal
  openModal = (event) => {
    event.preventDefault();
    let item = [];
    let itemfunction = null;
    // eslint-disable-next-line default-case
    switch(event.target.value) {
      case '받기':
        item = this.state.receivetrade
        itemfunction = this.getReceiveList
        break
      case '보내기':
        item = this.state.sendtrade
        itemfunction = this.getSendList
        break
      case '헌혈증':
        item = this.state.myblood
        itemfunction = this.getBlood
        break
    }

    this.setState({
      isModalOpen: true, 
      modalTitle: event.target.name,
      content: item,
      handler: itemfunction
    })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    return(
      <div>
        <div id="container">
          <div className="column">
            <div className="sh_group">
              <div className="sh_header">
                <h3>개인정보</h3>
              </div>
              <div className="sh_content">
                <div className='sh_lst'>
                  <div className='sh_lst_items lst_items'>이름</div>
                  <div className='sh_lst_items lst_item'>{this.state.name}</div>
                </div>
                <div className='sh_lst'>
                  <div className='sh_lst_items lst_items'>이메일</div>
                  <div className='sh_lst_items lst_item'>{this.state.email}</div>
                </div>
                
                <div className='sh_lst'>
                  <div className='sh_lst_items lst_items' id="phone">전화번호</div>
                  <div className='sh_lst_items lst_item' id="phonevalue">{this.state.phone}</div>
                </div>
                <div className='sh_lst'>
                  <div className='sh_lst_items lst_items' id="second">2차 비밀번호</div>
                  <Link to="/secondpw" className='sh_lst_items link_btn' id="secondvalue">수정</Link>
                </div>
              </div>
            </div>
            <div className="sh_group">
              <div className="sh_header">
                <h3>거래기록(받기)</h3>
              </div>
              <div className="sh_content">
                {this.getReceiveList(this.state.receivetrade, 5)}
              </div>
              <button name='거래기록(받기)'className="modal_btn" onClick={this.openModal} value="받기">+</button>
            </div>
          </div>
          <div className="column">
            <div className="sh_group">
              <div className="sh_header">
                <h3>헌혈증 {this.state.count}개</h3>
              </div>
              <div className="sh_content">
                {this.getBlood(this.state.myblood)}
              </div>
              <button name='헌혈증'className="modal_btn" onClick={this.openModal} value="헌혈증">+</button>
            </div>
            <div className="sh_group">
              <div className="sh_header">
                <h3>거래기록(보내기)</h3>
              </div>
              <div className="sh_content">
                {this.getSendList(this.state.sendtrade)}
              </div>
              <button name='거래기록(보내기)'className="modal_btn" onClick={this.openModal} value="보내기">+</button>
            </div>
          </div>
          <ModalPages 
            isOpen={this.state.isModalOpen} 
            close={this.closeModal}
            title={this.state.modalTitle}
            content={this.state.content}
            handler={this.state.handler}
          />
        </div>
      </div>
    );
  }
}

export default MyInfo;