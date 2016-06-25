import React from 'react'
import { checkHttpStatus, parseJSON } from '../../utils/webUtils'
import Register from '../../containers/Register'


class CounterView extends React.Component {

  constructor(props) {
    super(props)
  }

  fetchRequest() {
    var profileImageInput = $('#fileInput')
    var file = profileImageInput[0].files[0]
    console.log(file.name)
    console.log(file.size)
    console.log(file.type)

    var formData = new FormData();
    formData.append('type', 'file');
    formData.append('file', file);
    fetch('http://localhost:9010/api/v1/profile/10/image', {
      method: 'post',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        $('#showbox').text(error)
      })
  }

  render() {
    return (
      <div id='wfx-price'>
        <div>
          <label for='fileInput'>Upload File: </label>
          <input type='file' name='profileImage' id='fileInput' />
        </div>
        <button onClick={this.fetchRequest.bind(this)}> Submit Upload </button>
        <div id='showbox'>
          1234
        </div>
        <Register />
      </div>
    )
  }
}

export default CounterView
