import React, {Component} from 'react';

class Answer extends Component {
  render() {
    return (<div id={'segment-' + this.props.index}>
      <img src={this.props.gif}></img>
    </div>);
  }
}

export default Answer;
