import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import React from 'react'
let Carousel = require('react-responsive-carousel').Carousel

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }
  
  onLogout() {
    Accounts.logout()
    localStorage.removeItem('iroamUser')
  }
  
  renderSidenav(user) {
    return user[2] ? (
      <ul id="slide-out" className="side-nav grey darken-3">
        <li>
          <div className="userView">
            <div className="background">
              <img className='responsive-img' src="./bg.jpg"/>
            </div>
            <a href="#!user"><img className="circle" src="./helal.jpg"/></a>
            <a href="#!name"><span className="black-text name">{user[0]} {user[1]}</span></a>
            <a href="#!email"><span className="black-text email">{user[3]}</span></a>
          </div>
        </li>
        <li><a className="grey-text text-lighten-2 subheader">MY PROFILE</a></li>
        <li><a className="white-text waves-effect" href="#!">Age: 34</a></li>
        <li><a className="white-text waves-effect" href="#!">Weight: 176 lbs</a></li>
        <li><a className="white-text waves-effect" href="#!">Height: 5' 9''</a></li>
        <li><a className="white-text waves-effect" href="#!">Week of Rehab: 1</a></li>
        <li><div className="divider"></div></li>
        <li><a className="white-text waves-effect" href="#!">NOTIFICATIONS</a></li>
        <li><a className="white-text waves-effect" href="#!">SETTINGS</a></li>
      </ul>
    ) : (
      <ul id="slide-out" className="side-nav grey darken-3">
        <li>
          <div className="userView">
            <div className="background">
              <img className='responsive-img' src="./bg.jpg"/>
            </div>
            <a href="#!user"><img className="circle" src="./helal.jpg"/></a>
            <a href="#!name"><span className="black-text name">{user[0]} {user[1]}</span></a>
            <a href="#!email"><span className="black-text email">{user[3]}</span></a>
          </div>
        </li>
        <li><a className="grey-text text-lighten-2 subheader">MY PATIENTS</a></li>
        <li><a className="waves-effect grey lighten-2" href="#!">Johnny Appleseed</a></li>
        <li><a className="white-text waves-effect" href="#!">Homer Simpson</a></li>
        <li><a className="white-text waves-effect" href="#!">Bart Simpson</a></li>
        <li><a className="white-text waves-effect" href="#!">Marge Simpson</a></li>
        <li><a className="white-text waves-effect" href="#!">Maggie Simpson</a></li>
        <li><div className="divider"></div></li>
        <li><a className="white-text waves-effect" href="#!">NOTIFICATIONS</a></li>
        <li><a className="white-text waves-effect" href="#!">SETTINGS</a></li>
      </ul>
    )
  }
  
  render() {
    let user = localStorage['iroamUser'].split(',')
    user[2] = user[2] === 'true' ? true : false
    return (
      <div style={{height: 92+'vh'}}>
        {this.renderSidenav(user)}
        <nav className='black'>
          <div className='nav-wrapper'>
            <a href="#" data-activates="mobile-demo" className="button-collapse" onClick={()=> {$('document').ready(() => {$(".sidebar").sideNav()})}}>|||</a>
            <a href='#' className='brand-logo center'>
              <img height='50px' src='./iroam_logo.png' style={{marginTop: '5px'}}/>
              <span className='hide-on-med-and-down'>iRoam Dashboard</span>
            </a>
            <ul className='left hide-on-med-and-down'>
              {/* <li>{user[2] ? null : <a href="#" data-activates="slide-out" className="btn sidebar waves-effect waves-light blue" onClick={()=> {$('document').ready(() => {$(".sidebar").sideNav()})}}>Menu</a>}</li> */}
              <li><a href="#" data-activates="slide-out" className="btn sidebar waves-effect waves-light blue" onClick={()=> {$('document').ready(() => {$(".sidebar").sideNav()})}}>Menu</a></li>
              <li><span>Hello {user[2] ? 'Patient' : 'Dr.'} {user[0]} {user[1]}</span></li>
            </ul>
            <ul className='right hide-on-med-and-down'>
              <li><a className='btn grey darken-2 waves-effect waves-light' onClick={this.onLogout.bind(this)}>Logout</a></li>
            </ul>
            <ul className="side-nav" id="mobile-demo">
              <li>{user[2] ? null : <a href="#" data-activates="slide-out" className="btn sidebar" onClick={()=> {$('document').ready(() => {$(".sidebar").sideNav()})}}>Menu</a>}</li>
              <li><span>Hello {user[2] ? 'Patient' : 'Dr.'} {user[0]} {user[1]}</span></li>
              <li><a className='btn grey darken-2' onClick={this.onLogout.bind(this)}>Logout</a></li>
            </ul>
          </div>
        </nav>
        <Carousel showArrows={true} showThumbs={false}>
          <div style={{height:92+'vh'}}>
            <iframe src="https://app.initialstate.com/embed/#/tiles/LClWltNix08wwOIROPwkdzglK1htDCAL%3AMOD" width='100%' height='100%'></iframe>
          </div>
          <div style={{height:92+'vh'}}>
            <iframe src="https://app.initialstate.com/embed/#/tiles/1SWrzuyXV17nYafRkKxoBp0EGqiTtC2D%3AMOD" width='100%' height='100%'></iframe>
          </div>
        </Carousel>
      </div>
    )
  }
}