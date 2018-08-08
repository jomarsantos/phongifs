import React, {Component} from 'react';

class Button extends Component {
  componentDidMount() {
    if (this.props.focus) {
      this.button.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.focus) {
      this.button.focus();
    }
  }

  render() {
    return (
      <button
        ref={(button) => {
          this.button = button;
        }}
        onClick={this.props.onClickHandler}
        disabled={this.props.disabled}>
        {this.props.text}
      </button>
    )
  }
}

export default Button;
