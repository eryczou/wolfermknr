// We only need to import the modules necessary for initial render
import { injectReducer } from '../redux/reducers'
import WolferXApp from '../apps/WolferX'
import OneColumnLayout from '../layouts/OneColumnLayout'
import Sidebar from '../containers/Sidebar'
import AuthRequiredWrapper from '../containers/AuthRequiredWrapper'
import HomeViewRoute from './HomeView'
import BlogViewRoute from './BlogView'
import CounterRoute from './CounterView'
import TodoListViewRoute from './TodoListView'
import PostViewRoute from './PostView'
import TestViewRoute from './TestView'
import ProtectedViewRoute from './ProtectedView'

/**
 * Note: Instead of using JSX, we recommend using react-router
 * PlainRoute objects to build route definitions.
 */
export const createRoutes = (store) => ({
  path: '/',
  component: WolferXApp,
  childRoutes: [
    {
      components: {children: OneColumnLayout, sidebar: Sidebar},
      indexRoute: HomeViewRoute,
      childRoutes: [
        BlogViewRoute(store),
        CounterRoute(store),
        TodoListViewRoute(store),
        PostViewRoute(store),
        TestViewRoute(store),
        {
          component: AuthRequiredWrapper,
          childRoutes: [
            ProtectedViewRoute(store)
          ]
        },
        {
          path: '*',
          onEnter: (nextState, replace) => replace('/')
        }
      ]
    }
  ]
})

export default createRoutes

