import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './MainHeader.scss'

function MainHeader ({ title, subTitle }) {
  return (
    <div className={ classes.pageHeader }>
      <div className={ classes.contentWrapper }>
        <div className={ classes.titleWrapper }>
          <h1 className={ classes.title }>
            { title }
          </h1>
          <div className={ classes.brand } >
            <Link to='/' >
              <img className={classes.logo} src={require('../../static/img/wolferx/wolferx_logo_hd.png')} />
            </Link>
          </div>
        </div>
        <div className={ classes.subTitle }>
          { subTitle }
        </div>
      </div>
    </div>
  )
}

MainHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired
}

export default MainHeader
