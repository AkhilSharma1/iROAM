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
    let userType = this.refs.toggle.checked
    
    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Check email and password'})
      } else {
        this.setState({error: ''})
        let name = email.split('@')[0]
        localStorage.setItem(`${Meteor.userId()}`, this.state.toggleChecked ? `Dr. ${name}` : `Patient ${name}`)
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
              <div className='row valign-wrapper'>
                <div className='col s3'>
                  <img className='responsive-img center' src='./iroam_logo.png'/>
                </div>
                <div className='col s9'>
                  <h1 className='grey-text text-lighten-4'>iROAM</h1>
                </div>
              </div>
            </div>
            <div className='card grey darken-2 center-align'>
              <div className='card-content'>
                <span className='card-title grey-text text-lighten-4'>Log in to dashboard</span>
                {this.state.error ? <p className='red-text text-darken-5'>{this.state.error}</p> : undefined}
                <br/>
                <div className='switch'>
                  <label>
                    Doctor
                    <input type='checkbox' ref='toggle' onChange={this.handleToggle.bind(this)} defaultChecked/>
                    <span className='lever'></span>
                    Patient
                  </label>
                </div>
                <form onSubmit={this.onSubmit.bind(this)} noValidate>
                  {this.props.children}
                  <input className='grey-text text-lighten-4' type='email' ref='email' name='email' placeholder='Email'/>
                  <input className='grey-text text-lighten-4' type='password' ref='password' name='password' placeholder='Password'/>
                  <button className='btn'>Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 m2 offset-m5'>
            <div className='card small red darken-2 center-align' style={{height: 'auto'}}>
              <div className='card-content white-text'>
                <span className='card-title grey-text text-lighten-4'>For Emergency:</span>
                <p>
                  Call - (999)999 999
                  <br/>
                  Doctor - Dr. Hibbert
                  <br/>
                  Patient - Mrs. M. Simpson
                  <br/>
                  Blood Group - B+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}