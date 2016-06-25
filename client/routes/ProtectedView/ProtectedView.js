import React from 'react'

export default class ProtectedView extends React.Component {

  constructor(props){
    super(props)
  }

  render () {
    return (
      <h3>
        This is a login required view.
        If you see this without logged in, please contact the web owner.
      </h3>
    )
  }

}
