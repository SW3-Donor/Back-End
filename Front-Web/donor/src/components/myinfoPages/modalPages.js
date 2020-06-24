import React from 'react';
import './Modal.scss';

const ModalPages = ({ isOpen, close, title, content, handler }) => {
  return (
    <React.Fragment>
    {
      isOpen ?
      <React.Fragment>
        <div className="Modal-overlay" onClick={close} />
        <div className="Modal">
          <p className="title">{title}</p>
          <div className="content">
            {handler(content)}
          </div>
          <div className="button-wrap">
            <button onClick={close}>확인 </button>
          </div>
        </div>
      </React.Fragment>
      :
      null
    }
    </React.Fragment>
  )
}

export default ModalPages;