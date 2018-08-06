import React, {Component} from 'react';

class Segment extends Component {
  render() {
    return (<div id={'segment-' + this.props.index}>
      {this.props.segment}
    </div>)
  }
}

export default Segment;
