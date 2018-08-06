import React, {Component} from 'react';

class Answer extends Component {
  render() {
    return (<div id={'segment-' + this.props.index}>
      <img src={this.props.gif}></img>
      <input id={'answer-' + this.props.index} onChange={e => this.props.handler(this.props.index, e.target.value)}></input>
    </div>);
  }
}

export default Answer;
