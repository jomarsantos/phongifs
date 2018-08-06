import React, {Component} from 'react';
import {connect} from 'react-redux'
import {testFetchAction, testAction} from '../actions/test';
import Answer from '../components/Answer';
import Segment from '../components/Segment';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rawSentence: '*cat* meowed at the *bird*',
      sentence: [],
      numberOfAnswers: false,
      gifs: {},
      input: {}
    };

    this.updateInputValue = this.updateInputValue.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);

  }

  componentDidMount() {
    let sentence = this.parseSentenceAndAnswers(this.state.rawSentence);
    this.setState({sentence: sentence});

    let answers = sentence.filter(segment => segment.answer);
    this.setState({numberOfAnswers: answers.length});

    sentence.forEach((segment, index) => {
      if (segment.answer) {
        fetch('https://api.giphy.com/v1/stickers/translate?api_key=dyifQG9fALzqJM17T37Di8ifZ6nM5aek&s=' + segment.value).then(response => response.json()).then(json => {
          this.setState({
            gifs: {
              ...this.state.gifs,
              [index]: json.data.images.fixed_width_small.url
            }
          })
        });
      }
    });
  }

  render() {
    if (!this.state.numberOfAnswers) {
      return (<div>
        loading
      </div>);
    }

    // Focus on the first answer for input
    let focus = true;
    let segmentElements = this.state.sentence.map((segment, index) => {
      if (segment.answer) {
        let element = <Answer key={index} index={index} gif={this.state.gifs[index]} focus={focus} handler={this.updateInputValue}/>;
        focus = false;
        return element;
      } else {
        return <Segment key={index} index={index} segment={segment.value}/>;
      }
    });

    return (<div>
      {segmentElements}
      <button onClick={() => this.checkAnswers()}>Submit</button>
      <button>Next</button>
    </div>);
  }

  //////////////////////
  // Helpers
  //////////////////////

  // Parses answers from the sentence provided
  parseSentenceAndAnswers(rawSentence) {
    let sentence = [];
    let ongoingAnswer = [];
    let ongoingSentenceSegment = [];
    let processingAnswer = false;
    for (let i = 0; i < rawSentence.length; i++) {
      let char = rawSentence.charAt(i);

      if (!processingAnswer && char === '*') {
        // End of a sentence segment
        if (ongoingSentenceSegment.length !== 0) {
          let sentenceSegment = ongoingSentenceSegment.join('');
          sentence.push({value: sentenceSegment, answer: false});
          ongoingSentenceSegment = [];
        }
        // Start of a new answer
        processingAnswer = true;
      } else if (processingAnswer && char === '*') {
        // Finished current answer
        let answer = ongoingAnswer.join('');
        answer = answer.trim();
        sentence.push({value: answer, answer: true});
        ongoingAnswer = [];
        processingAnswer = false;
      } else if (processingAnswer) {
        // Add to current answer
        ongoingAnswer.push(char);
      } else {
        // Add to sentence segment
        ongoingSentenceSegment.push(char);
      }
    }

    return sentence;
  }

  // Handler for answers values inputted
  updateInputValue(index, value) {
    this.setState({
      input: {
        ...this.state.input,
        [index]: value
      }
    })
  }

  // Check answers on submission
  checkAnswers() {
    Object.keys(this.state.input).forEach(index => {
      let correct = false;
      if (this.state.input[index] === this.state.sentence[index].value) {
        correct = true;
      }

			let sentence = JSON.parse(JSON.stringify(this.state.sentence));
			sentence[index].correct = correct;

      this.setState({
      	sentence: sentence
      });
    });
  }
}

//////////////////////
// Mappings
//////////////////////

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
