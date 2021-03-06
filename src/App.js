import React, { Component } from 'react';
import Config from './config.json';
import Ideas from './Components/Ideas/Ideas';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { Route, Redirect, HashRouter, Link } from 'react-router-dom';
import IdeasForm from './Components/Ideas/ideasForm';
import IdeasShow from './Components/Ideas/ideasShow';
import IdeasEdit from './Components/Ideas/ideasEdit';
import ScrollToTop from './Components/UI/ScrollToTop';
import validator from 'validator';
import './App.scss';

class App extends Component {

  constructor() {
    super()
      this.state = {
        route: 'signin',
        isAuthenticated: false,
        user: null, 
        token: ''
        }
    this.logout = this.logout.bind(this);
  }

  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null});
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    localStorage.removeItem('fullName')
  };

googleResponse = (response) => {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              access_token: response.accessToken
            }),
            mode: 'cors',
            cache: 'default'
        };
        fetch('https://mighty-springs-20769.herokuapp.com/api/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            if (token) {
              r.json().then(user => {
                  localStorage.setItem('userid', user.id); 
                  localStorage.setItem('token', token);
                  localStorage.setItem('fullName', user.fullName);
                  this.setState({isAuthenticated: true, user, token});  
              });
            } else {
              alert("Use a Gmail Email to Log In")
              }
        })
    };

  componentDidMount() {
   let authtoken = localStorage.getItem('token');
   let userid = localStorage.getItem('userid')
   const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'token': authtoken,
              'id': userid
            }),
            mode: 'cors',
            // cache: 'default'
        };
   fetch('https://mighty-springs-20769.herokuapp.com/api/google/auth', options)
      .then(res => {
     return res.json();
        })
        .then(user => {
          if (user.id === userid) {
            this.setState({ isAuthenticated: true, 
                    user: user,
                    token: authtoken });
          }
        })
      }

  render() {
    let loggedinuser = this.state.user;
    return (
      <HashRouter basename="/app">
        <ScrollToTop>
          <div className="App">
             { <header className="app-header">
                <h1><Link to="/ideas">Hackathon Ideas Forum</Link></h1>
                <div className="cond-button">
                  { 
                    (this.state.isAuthenticated === true)
                      ? <div className="button-row"><div><Link to="/ideasForm" className="button">Submit an Idea</Link></div>
                        <div onClick={this.logout} className="button">Log out</div></div>
                      : <div></div>
                  }
                </div>
              </header>}
              <div className="app-body">

                {<Route  exact path="/" 
                        render={(props) => (
                        this.state.isAuthenticated === true ? (  
                          <Redirect to="/ideas"/>
                          ) : (
                          <div className="googsloginpage">
                            <GoogleLogin
                            clientId={Config.GOOGLE_CLIENT_ID}
                            render={renderProps => (
                                <button className="googlebutton"
                                        onClick={renderProps.onClick}>Sign In with Gmail</button>
                              )}
                            buttonText="Mufukin Google Login"
                            onSuccess={this.googleResponse}
                            onFailure={this.googleResponse}
                          />
                        </div>)
                      )}/>}

                <Route  path="/ideas" 
                        render={(props) => (
                        localStorage.getItem('token') === null ? (  
                          <Redirect to="/"/>
                          ) : (
                          <Ideas user={loggedinuser} />)
                      )}/>

                <Route  path="/ideasShow/:id" 
                        render={({ props, match }) => (
                        localStorage.getItem('token') === null ? (  
                          <Redirect to="/"/>
                          ) : (
                          <IdeasShow user={loggedinuser} match={match} />)
                      )}/>

                <Route  path="/ideasEdit/:id" 
                        render={({ props, match }) => (
                        this.state.isAuthenticated === false ? (  
                          <Redirect to="/"/>
                          ) : (
                          <IdeasEdit match={match} />)
                      )}/>


                <Route  path="/ideasForm" 
                        render={(props) => (
                        this.state.isAuthenticated === false ? (  
                          <Redirect to="/"/>
                          ) : (
                          <IdeasForm user={loggedinuser} />)
                      )}/>
              </div>
            </div>
          </ScrollToTop>
        </HashRouter>
    );
  }
}

export default App;
