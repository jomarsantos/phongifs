import React, {Component} from 'react';

class Answer extends Component {
  componentDidMount() {
    if (this.props.focus) {
      this.input.focus();
    }
  }

  componentDidUpdate() {
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
      <div id={'segment-' + this.props.index} className={this.props.className}>
        <img src={this.props.gif}></img>
        <input
          ref={(input) => {
            this.input = input;
          }}
          id={'answer-' + this.props.index}
          value={this.props.value}
          onChange={e => this.props.onChangeHandler(this.props.index, e.target.value)}
          onKeyDown={e => this.props.onKeyDownHandler(this.props.index, e.keyCode)}
          maxLength={this.props.answer.length}
          size={this.props.answer.length}
          readOnly={this.props.submitted}></input>
        {correct}
      </div>
    );
  }
}

export default Answer;
