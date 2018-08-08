import React, {Component} from 'react';

class Segment extends Component {
  render() {
    return (<div id={'segment-' + this.props.index} className={this.props.className}>
      {this.props.segment}
    </div>)
  }
}

export default Segment;
