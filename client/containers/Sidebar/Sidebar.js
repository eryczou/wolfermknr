import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import { connect } from 'react-redux'

import Login from '../Login/Login'
import Register from '../Register/Register'
import classes from './Sidebar.scss'
import { actions as SidebarActions } from '../../redux/modules/sidebar'


class Sidebar extends React.Component {

  static propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    showSidebar: PropTypes.func.isRequired,
    switchOption: PropTypes.func.isRequired,
    isToggled: PropTypes.bool.isRequired,
    option: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      isHovering: false
    }
  }

  toggleSidebar(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.toggleSidebar()
    this.setState({ isHovering: false })
  }

  showSidebar(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.showSidebar()
    this.setState({ isHovering: false })
  }

  onMouseOver(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isHovering: true })
  }

  onMouseOut(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isHovering: false })
  }

  onOptionClick(option, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.switchOption(option)
  }



  render() {

    let { isToggled, option } = this.props
    let { isHovering } = this.state

    const sidebarClass = classes.sidebar + ' '
      + (isToggled && isHovering? classes.onHovering : ' ')

    const toggleButtonClass = 'glyphicon '
      + (isToggled? 'glyphicon-chevron-left ' : 'glyphicon-chevron-right ')
      + classes.toggleButton

    const topClickZoneClass = classes.topClickZone + ' ' + (isToggled? classes.cursorShow : classes.cursorHide)

    let sidebarOption
    switch (option) {
      case 'signUp':
        sidebarOption =
          <div className={classes.optionWrapper}>
            <div className= {classes.optionHeader}>
              <div className={`label label-danger ${classes.optionTitle}`}>
                SignUP
              </div>
              <span className={classes.optionSlash}> &#47; </span>
              <div className={`label label-default ${classes.optionSubTitle}`}
                   onClick={this.onOptionClick.bind(this, 'logIn')}>LogIN</div>
            </div>
            <Register />
          </div>
        break
      case 'logIn':
        sidebarOption =
          <div className={classes.optionWrapper}>
            <div className= {classes.optionHeader}>
              <div className={`label label-danger ${classes.optionTitle}`}>
                LogIN
              </div>
              <span className={classes.optionSlash}> &#47; </span>
              <div className={`label label-default ${classes.optionSubTitle}`}
                   onClick={this.onOptionClick.bind(this, 'signUp')}>SignUP</div>
            </div>
            <Login />
          </div>
        break
    }

    return (
      <Motion style={{ sidebarWidth: spring(isToggled? 0 : 330, [120, 15]) }} >
        {
          ({ sidebarWidth }) =>
            <div className={sidebarClass}
                 onClick={isToggled? this.toggleSidebar.bind(this) : null}
                 onMouseOver= {isToggled? this.onMouseOver.bind(this) : null}
                 onMouseOut= {isToggled? this.onMouseOut.bind(this) : null}
                 style={{ width: sidebarWidth }} >
              <div id='sidebar-header' className={classes.header} >
                <div className={topClickZoneClass}
                     onClick={isToggled? null : this.toggleSidebar.bind(this)} >
                </div>
                <i className={toggleButtonClass} aria-hidden='true' ></i>
              </div>
              <div id='sidebar-content-wrapper' className={classes.contentWrapper}>
                {sidebarOption}
              </div>
            </div>
        }
      </Motion>
    )
  }
}

function mapStateToProps(state) {
  return {
    isToggled: state.sidebar.isToggled,
    option: state.sidebar.option
  }
}

export default connect(mapStateToProps, SidebarActions)(Sidebar)

