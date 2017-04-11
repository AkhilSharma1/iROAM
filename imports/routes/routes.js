import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

import Login from '../ui/Login'
import Dashboard from '../ui/Dashboard'

const unauthPages = ['/', 'signup']
const authPages = ['/dashboard']

const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/dashboard')
  }
}

const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/')
  }
}

export const onAuthChange = (isAuthenticated) => {
  const pathname = browserHistory.getCurrentLocation().pathname
  const isUnauthPage = unauthPages.includes(pathname)
  const isAuthPage = authPages.includes(pathname)
  
  if (isUnauthPage && isAuthenticated) {
    browserHistory.replace('/dashboard')
  } else if (isAuthPage && !isAuthenticated) {
    browserHistory.replace('/')
  }
}

export const routes = (
  <Router history={browserHistory}>
    <Route path='/' component={Login} onEnter={onEnterPublicPage}/>
    <Route path='/dashboard' component={Dashboard} onEnter={onEnterPrivatePage}/>
    <Route path='*' component={Login} onEnter={browserHistory.replace('/')}/>
  </Router>
)