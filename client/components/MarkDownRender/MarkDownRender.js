import React, { PropTypes } from 'react'
import Remarkable from 'remarkable'

const md = new Remarkable({
  breaks: true
})

class MarkDownRender extends React.Component {

  static propTypes = {
    mdContent: PropTypes.string.isRequired
  }

  render() {

    const { mdContent } = this.props

    return (
      <div dangerouslySetInnerHTML={{__html: md.render(mdContent)}}>
      </div>
    )
  }
}

export default MarkDownRender
