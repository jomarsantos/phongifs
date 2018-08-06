import React, {Component} from 'react';
import {connect} from 'react-redux'
import {testFetchAction, testAction} from '../actions/test';
import Answer from '../components/Answer';
import Segment from '../components/Segment';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rawSentence: '<ice cream> was orange',
      sentences: [],
      completedSentences: {},
      sentence: [],
      gifs: {},
      input: {},
      submitted: false
    };

    this.setNextSentence = this.setNextSentence.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);
  }

  componentDidMount() {
    fetch('/sentences.json').then(response => response.json()).then(json => {
      this.setState({
        sentences: json
      }, this.setNextSentence);
    });
  }

  render() {
    // Focus on the first answer for input
    let focus = true;
    let segmentElements = this.state.sentence.map((segment, index) => {
      if (segment.answer) {
        let element = <Answer
          key={index}
          index={index}
          gif={this.state.gifs[index]}
          answer={segment.value}
          correct={segment.correct}
          submitted={this.state.submitted}
          focus={focus}
          handler={this.updateInputValue}/>;
        focus = false;
        return element;
      } else {
        return <Segment key={index} index={index} segment={segment.value}/>;
      }
    });

    return (
      <div>
        {segmentElements}
        <button onClick={() => this.checkAnswers()} disabled={this.state.submitted}>Submit</button>
        <button>Next</button>
      </div>
    );
  }

  /****************************************
	Helpers
	****************************************/

  // Sets up next sentences
  setNextSentence() {
    // TODO: check if all questions have been answered

    let randomIndex = -1;
    do {
      randomIndex = Math.floor(Math.random() * Math.floor(this.state.sentences.length));;
    } while (this.state.completedSentences.hasOwnProperty(randomIndex));
    this.setState({
      completedSentences: {
        ...this.state.completedSentences,
        [randomIndex]: true
      }
    })

    let sentence = this.parseSentenceAndAnswers(this.state.sentences[randomIndex].sentence);
    this.setState({sentence: sentence});

    sentence.forEach((segment, index) => {
      if (segment.answer) {
        fetch('https://api.giphy.com/v1/stickers/translate?api_key=dyifQG9fALzqJM17T37Di8ifZ6nM5aek&s=' + segment.value).then(
          response => response.json()
        ).then(json => {
          this.setState({
            gifs: {
              ...this.state.gifs,
              [index]: json.data.images.fixed_width_small.url
            }
          });
        });
      }
    });
  }

  // Parses answers from the sentence provided
  parseSentenceAndAnswers(rawSentence) {
    let sentence = [];

    let splitByEndParts = rawSentence.split('>');
    splitByEndParts.forEach(splitByEndPart => {
      if (splitByEndPart.trim() !== '') {
        let parts = splitByEndPart.split('<');
        sentence.push({value: parts[0], answer: false});

        if (parts.length > 1) {
          sentence.push({value: parts[1], answer: true, correct: null});
        }
      }
    });

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

      this.setState({sentence: sentence});
    });
    this.setState({submitted: true});
  }
}

/****************************************
Mappings
****************************************/

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
