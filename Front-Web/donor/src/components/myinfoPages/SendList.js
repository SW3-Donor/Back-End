import React from 'react';

function SendList({date, receiver}){
  return(
    <div className='sh_lst'>
      <div className='sh_lst_items lst_items'>{new Date(date).toLocaleDateString()}</div>
      <div className='sh_lst_items lst_item'>{receiver}</div>
    </div>
  );
}

export default SendList;