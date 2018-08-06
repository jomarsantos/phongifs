import React, {Component} from 'react';
import {connect} from 'react-redux'
import {testFetchAction, testAction} from '../actions/test';
import TestComponent from '../components/TestComponent';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currSentence: 'the *cat* meowed at the *bird*',
      answers: [],
      gifs: {}
    };
  }

  componentDidMount() {
    let answers = this.getAnswers(this.state.currSentence);
    this.setState({answers: answers});

    answers.forEach((value, index) => {
      fetch('https://api.giphy.com/v1/stickers/translate?api_key=dyifQG9fALzqJM17T37Di8ifZ6nM5aek&s='+value).then(response => response.json()).then(json => {
				this.setState({
						gifs: {
								...this.state.gifs,
								[index]: json.data.embed_url
						}
				})
      });
    });
  }

  // test() {
  //   if (this.props.testField == 'OFF') {
  //     this.props.testFetchAction();
  //   } else {
  //     this.props.testAction('OFF');
  //   }
  // }

  // render() {
  //   return (<div>
  //     <TestComponent testProp={this.props.testField}/>
  //     <button onClick={() => {
  //         this.test()
  //       }}>TOGGLE</button>
  //   </div>);
  // }

	render() {
    return (<div>
      {this.state.currSentence}
    </div>);
  }

  //////////////////////
  // Helpers
  //////////////////////

  // Parses answers from the sentence provided
  getAnswers(sentence) {
    let answers = [];
    let ongoingAnswer = [];
    let processingAnswer = false;
    for (let i = 0; i < sentence.length; i++) {
      let char = sentence.charAt(i);

      if (!processingAnswer && char === '*') {
        // Start of a new answer
        processingAnswer = true;
      } else if (processingAnswer && char === '*') {
        // Finished current answer
        let answer = ongoingAnswer.join('');
        answer = answer.trim();
        answers.push(answer);
				ongoingAnswer = [];
        processingAnswer = false;
      } else if (processingAnswer) {
        // Add to current answer
        ongoingAnswer.push(char);
      }
    }

    return answers;
  }

}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
