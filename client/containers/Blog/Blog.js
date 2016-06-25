import React from 'react'
import { connect } from 'react-redux'
import classes from './Blog.scss'
import MDRender from '../../components/MarkDownRender/MarkDownRender'
import SimpleMDE from '../MarkDownEditor/MarkDownEditor'

class Blog extends React.Component {
  render() {

    const { mdContent } = this.props

    return (
      <div id='wfx-blog'>
        <MDRender mdContent={ mdContent } />
        <SimpleMDE />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    mdContent: state.mde.mdContent
  }
}

export default connect(mapStateToProps)(Blog)
