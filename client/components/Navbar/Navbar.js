import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classes from './Navbar.scss'

class Navbar extends React.Component {

  render() {
    return (
      <nav className={ classes.navbarContainer }>
        <div className={ classes.listWrapper }>
          <Link to='/' className={ classes.link } >Home</Link>
          <Link to='/blog' className={ classes.link } >Blog</Link>
          <Link to='/counter' className={ classes.link } >Counter</Link>
          <Link to='/todo' className={ classes.link } >TodoList</Link>
          <Link to='/post' className={ classes.link } >Post</Link>
          <Link to='/protected' className={ classes.link } >Protected</Link>
        </div>
      </nav>
    )
  }
}

export default Navbar
