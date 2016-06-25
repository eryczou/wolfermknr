import React from 'react'
import '../../styles/main.scss'
import classes from './WolferX.scss'

export const WolferX = ({ children, sidebar }) => (

  <div className={classes.appContainer}>
    {sidebar}
    {children}
  </div>
)

WolferX.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default WolferX
