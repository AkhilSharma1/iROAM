import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import React from 'react'
let Carousel = require('react-responsive-carousel').Carousel

export default class Dashboard extends React.Component {
  onLogout() {
    Accounts.logout()
    localStorage.removeItem(Meteor.userId())
  }
  
  render() {
    let user = localStorage[Meteor.userId()]
    return (
      <div style={{height: 92+'vh'}}>
        <div className='row center-align'>
          <div className='col s12 m4'>
            <h5 className='grey-text text-lighten-4'>iROAM Dashboard</h5>
          </div>
          <div className='col s12 m4'>
            <h5 className='grey-text text-lighten-4'>Hello {user}</h5>
          </div>
          <div className='col s12 m4' style={{paddingTop:'10px'}}>
            <button className='btn grey darken-2' onClick={this.onLogout.bind(this)}>Logout</button>
          </div>
        </div>
        {/* <div className='carousel' ref='carousel' style={{height:92+'vh'}}>
          <a className='carousel-item' href='#one'>
            
          </a>
          <a className='carousel-item' href='#two'>
            <iframe src="https://app.initialstate.com/embed/#/tiles/MaalmGVgJ6t9NmjsTR3WKSHbZCVw5YoH%3AMOD" width='100%' height='100%'></iframe>
          </a>
        </div> */}
        <Carousel showArrows={true} showThumbs={false}>
          <div style={{height:92+'vh'}}>
            <iframe src="https://app.initialstate.com/embed/#/tiles/MaalmGVgJ6t9NmjsTR3WKSHbZCVw5YoH%3AMOD" width='100%' height='100%'></iframe>
          </div>
          <div style={{height:92+'vh'}}>
            <iframe src="https://app.initialstate.com/embed/#/tiles/MaalmGVgJ6t9NmjsTR3WKSHbZCVw5YoH%3AMOD" width='100%' height='100%'></iframe>
          </div>
        </Carousel>
      </div>
    )
  }
}