import React, {Component} from 'react';

class Answer extends Component {
  componentDidMount() {
    if (this.props.focus) {
      this.input.focus();
    }
  }

  render() {
    let correct = null;
    let readOnly = false;
    if (this.props.correct) {
      correct = 'correct'
    } else if (this.props.submitted) {
      correct = this.props.answer
    }

    return (
      <div id={'segment-' + this.props.index}>
        <img src={this.props.gif}></img>
        <input
          ref={(input) => {
            this.input = input;
          }}
          id={'answer-' + this.props.index}
          onChange={e => this.props.handler(this.props.index, e.target.value)}
          readOnly={this.props.submitted}></input>
        {correct}
      </div>
    );
  }
}

export default Answer;
