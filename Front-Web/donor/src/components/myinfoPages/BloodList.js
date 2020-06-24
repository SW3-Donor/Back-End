import React from 'react';

function BloodList({date, number}) {
  return (
    <div className='sh_lst'>
      <div className='sh_lst_items lst_items'>{new Date(date).toLocaleDateString()}</div>
      <div className='sh_lst_items lst_item'>{number}</div>
    </div>
  );
}

export default BloodList;