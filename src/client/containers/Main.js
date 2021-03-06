import React, {Component} from 'react';
import {connect} from 'react-redux'
import {testFetchAction, testAction} from '../actions/test';
import Answer from '../components/Answer';
import Segment from '../components/Segment';
import Button from '../components/Button';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sentences: [], // Bank of sentences
      completedSentences: {}, // Ongoing list of completed sentences

      sentenceIndex: false, // Index of current sentence
      sentence: [], // Current sentence broken down
      gifs: {}, // Gifs for the current sentence

      input: {}, // Input from the user
      focus: false, // Index of answer to focus
      submitted: false, // Flag that user has submitted their guesses
      score: 0, // Score of the user
      maxScore: 0 // Max possible score so far
    };

    this.setNextSentence = this.setNextSentence.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
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
    let segmentElements = this.state.sentence.map((segment, index) => {
      let value = ''
      if (this.state.input.hasOwnProperty(index)) {
        value = this.state.input[index]
      }

      if (segment.answer) {
        let element = <Answer
          className='answer'
          key={this.state.sentenceIndex + '-' + index}
          index={index}
          gif={this.state.gifs[index]}
          answer={segment.value}
          value={value}
          correct={segment.correct}
          submitted={this.state.submitted}
          focus={this.state.focus === index}
          onChangeHandler={this.updateInputValue}
          onKeyDownHandler={this.handleKeyDown}/>;
        return element;
      } else {
        return <Segment className='segment' key={index} index={index} segment={segment.value}/>;
      }
    });

    return (
      <div id='main'>
        <div id="sentence">
          {segmentElements}
        </div>
        <div id='buttons'>
          <Button
            text='Submit'
            onClickHandler={this.checkAnswers}
            disabled={this.state.submitted}
            focus={this.state.focus === 'submit'}/>
          <Button
            text='Next'
            onClickHandler={this.setNextSentence}
            disabled={!this.state.submitted}
            focus={this.state.focus === 'next'}/>
        </div>
        <div id='score'>
          <p>Score: {this.state.score}/{this.state.maxScore}</p>
        </div>
      </div>
    );
  }

  /****************************************
	Helpers
	****************************************/

  // Sets up next sentences
  setNextSentence() {
    this.setState({input: {}, submitted: false});

    // Completed all sentences
    if (Object.keys(this.state.completedSentences).length == this.state.sentences.length) {
      // TODO: set state for "completedAllSentences == true"
      return false;
    }

    let randomIndex = -1;
    do {
      randomIndex = Math.floor(Math.random() * Math.floor(this.state.sentences.length));;
    } while (this.state.completedSentences.hasOwnProperty(randomIndex));
    this.setState({
      completedSentences: {
        ...this.state.completedSentences,
        [randomIndex]: true
      },
      sentenceIndex: randomIndex
    })

    let sentence = this.parseSentenceAndAnswers(this.state.sentences[randomIndex].sentence);
    this.setState({sentence: sentence});

    let focus = true;
    sentence.forEach((segment, index) => {
      if (segment.answer) {
        // Set focus on first answer
        if (focus) {
          this.setState({focus: index});
          focus = false;
        }

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
    });

    // Move focus if there is another answer - Else focus submit (true)
    focus = index
    if (value.length === this.state.sentence[index].value.length) {
      focus = 'submit';
      for (let i = index + 1; i < this.state.sentence.length; i++) {
        if (this.state.sentence[i].answer) {
          focus = i;
          break;
        }
      }
    }
    this.setState({focus: focus});
  }

  // Handler for key pressed, mainly backspace handling
  handleKeyDown(index, keyCode) {
    if (keyCode === 8) {
      // Move focus to a previous answer
      let focus = index
      if (this.state.input[index] === undefined || this.state.input[index].length == 0) {
        for (let i = index - 1; i >= 0; i--) {
          if (this.state.sentence[i].answer) {
            focus = i;
            break;
          }
        }
      }
      this.setState({focus: focus});
    }
  }

  // Check answers on submission
  checkAnswers() {
    let points = 0;
    let sentence = JSON.parse(JSON.stringify(this.state.sentence));
    Object.keys(this.state.input).forEach(index => {
      let correct = false;
      if (this.state.input[index] === this.state.sentence[index].value) {
        correct = true;
        points++;
      }

      sentence[index].correct = correct;
    });

    let answers = this.state.sentence.filter(segment => {
      return segment.answer
    });

    this.setState({
      sentence: sentence,
      submitted: true,
      score: this.state.score + points,
      maxScore: this.state.maxScore + answers.length,
      focus: 'next'
    });
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
