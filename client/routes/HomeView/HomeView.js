import React from 'react'
import ArticleBox from '../../components/ArticleBox/ArticleBox'
import classes from './HomeView.scss'

const content = `
**Architecture**
Nginx, Reactjs, Nodejs, MySQL

**Philosophy**
Deploy the best practice of engineering to issues
that encountered during implementation.

**Atmosphere**
Here is for meet up! group up! talk and learn!
for not being alone when gear something up.

**Goal**
To build a solid web application end-to-end solution, that
helps any great idea become a tangible product easier,
faster, and reliable.
`

export const HomeView = () => (
  <div className={ classes.homeView }>
    <ArticleBox content={ content } />
  </div>
)

export default HomeView
