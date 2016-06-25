import React, { PropTypes } from 'react'
import classes from './ListItem.scss'

function ListItem ({ item }) {
  return (
    <div className={classes.listItem}>
      <div>
        {item.doc}
      </div>
      <span className='badge'>
        {item.keywords}
      </span>
    </div>
  )
}

ListItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default ListItem
