import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Link } from 'react-router'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggleChecked: false,
      error: ''
    }
  }
  
  onSubmit(e) {
    e.preventDefault()
    
    let email = this.refs.email.value.trim()
    let password = this.refs.password.value.trim()
    
    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Check email and password'})
      } else {
        this.setState({error: ''})
        localStorage.setItem(`iroamUser`, `${Accounts.user().profile.firstName},${Accounts.user().profile.lastName},${Accounts.user().profile.isPatient},${Accounts.user().emails[0].address}`)
      }
    })
  }
  
  handleToggle(checked) {
    this.setState({
      toggleChecked: checked
    })
  }
  
  render() {
    return (
      //login card
      <div>
        <div className='row'>
          <div className='col s12 m4 offset-m4'>
            <div className='container center-align'>
              <div className='row valign-wrapper' style={{paddingTop:'30px'}}>
                <div className='col s5'>
                  <img className='responsive-img right-align' src='./iroam_logo.png'/>
                </div>
                <div className='col s7'>
                  <h1 className='left-align grey-text text-lighten-4'>iROAM</h1>
                </div>
              </div>
            </div>
            <br/>
            <br/>
            <br/>
            <div className='card grey darken-2 center-align'>
              <div className='card-content'>
                <h5 className='grey-text text-lighten-4'>Log in to dashboard</h5>
                <br/>
                {this.state.error ? <p className='red-text text-darken-5'>{this.state.error}</p> : undefined}
                <form onSubmit={this.onSubmit.bind(this)} noValidate>
                  {this.props.children}
                  <input className='grey-text text-lighten-4 center' type='email' ref='email' name='email' placeholder='Email'/>
                  <input className='grey-text text-lighten-4 center' type='password' ref='password' name='password' placeholder='Password'/>
                  <button className='btn waves-light waves-effect blue'>Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <div className='row'>
          <div className='col s12 m4 offset-m4'>
            <div className='card small red darken-2 center-align' style={{height: 'auto'}}>
              <div className='card-content white-text'>
                <h5>In Case of Emergency:</h5>
                <div className='row'>
                  <div className='col s6 right-align'>
                    <h5>Call:</h5>
                    <h5>Doctor:</h5>
                    <h5>Patient:</h5>
                    <h5>Blood Group:</h5>
                  </div>
                  <div className='col s6 left-align'>
                    <h5><a style={{color:'#ffffff', textDecoration:'underline'}} href='tel:(999)999-999'><b>999-999-9999</b></a></h5>
                    <h5><b>Dr. Doe</b></h5>
                    <h5><b>Mr. J. Appleseed</b></h5>
                    <h5><b>B+</b></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}