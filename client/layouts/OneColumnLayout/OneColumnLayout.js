import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import { connect } from 'react-redux'
import classes from './OneColumnLayout.scss'
import MainHeader from '../../components/MainHeader'
import Navbar from '../../components/Navbar'
import { actions as SidebarActions } from '../../redux/modules/sidebar'


class OneColumnLayout extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    isSidebarToggled: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props)
    this.showSidebar = this.showSidebar.bind(this)
  }

  showSidebar(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.showSidebar()
  }

  render() {

    const { isSidebarToggled, children } = this.props

    const showSidebarToggler = (isSidebarToggled) => {
      if (isSidebarToggled) {
        return (
          <span className={`glyphicon glyphicon-list ${ classes.sidebarToggler }`}
                onClick={this.showSidebar} ></span>
        )
      }
    }

    return (
      <Motion style={{ sidebarWidth: spring(this.props.isSidebarToggled? 0 : 330, [120, 15]) }}>
        {
          (val) =>
            <div className={ classes.layoutContainer } style={{ 'paddingRight': val.sidebarWidth }}>
              <div className={ classes.viewContainer }>
                <header className={ classes.headerContainer }>
                  { showSidebarToggler(isSidebarToggled) }
                  <MainHeader title='WolferX' subTitle='...life is short, only sharing makes it bloom' />
                  <Navbar />
                </header>
                <div className={ classes.bodyContainer }>
                  {children}
                </div>
              </div>
            </div>
        }
      </Motion>
    )
  }
}

function mapStateToProps(state) {
  return {
    isSidebarToggled: state.sidebar.isToggled
  }
}

export default connect(mapStateToProps, SidebarActions)(OneColumnLayout)

