import React, { PropTypes } from 'react'
import classes from './ArticleBox.scss'
import MarkDownRender from '../MarkDownRender/MarkDownRender'

function ArticleBox ({ content }) {
  return (
    <article className={ classes.article }>
      <MarkDownRender mdContent={ content } />
    </article>
  )
}

ArticleBox.propTypes = {
  content: PropTypes.string.isRequired
}

export default ArticleBox
