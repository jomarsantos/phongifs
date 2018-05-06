export const TEST = 'TEST';
export function testAction(word) {
  return {
    type: TEST,
    word: word
  };
}

export function testFetchAction() {
  return function (dispatch) {
		// TODO: abstract endpoint out to config file
    return fetch('/api/test', {
        method: 'GET',
      })
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(
        json => dispatch(testAction(json))
      )
  }
}
