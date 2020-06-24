import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BoardList extends Component {
  render(){
    return(
      <tr>
        <td align='center'>{this.props.num}</td>
        <td><Link to={`/board/list/${this.props.id}`}>{this.props.title}</Link></td>
        <td>{this.props.received} / {this.props.count}</td>
        <td align='center'>{this.props.name}</td>
        <td align='center'>{new Date(this.props.date).toLocaleDateString()}</td>
    </tr>
    );
  }
}


export default BoardList;