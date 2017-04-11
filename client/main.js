import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import ReactDOM from 'react-dom'

import {Events} from '../imports/api/pulses'

import { routes, onAuthChange } from '../imports/routes/routes'

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId()
  onAuthChange(isAuthenticated)
})

Meteor.startup(() => {  
  ReactDOM.render(routes, document.getElementById('app'))
})