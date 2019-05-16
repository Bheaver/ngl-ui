"use strict"

import React,{Component} from 'react';
import axios from 'axios';
import LibrarySelect from  "./LibrarySelect"
import "../global"

class Login extends Component{        
    constructor(props){
        super(props);     
        console.log(global.jwtToken)
        console.log(global.libCode)   
        let libraryIdSelected = this.props.libraryId;
        this.state = {
            libraryName: '',
            libraryCode: '',
            userName: '',
            password: '',
            showLoginSuccess: false,
            showLoginFailure: false            
        }
        axios.get('http://localhost:8081/aa/listLibraries'+'?libCode='+this.props.libraryId)
        .then(res => {
            console.log(res)
            this.setState({
                libraryName: res.data.response[0].libraryName,    
                libraryCode: res.data.response[0].libraryCode
            });
        })
    }
    loginHandler = () => {
        const data = {
            "libCode": this.state.libraryCode,
	        "username": this.state.userName,
	        "password": this.state.password
        }
        const headers = {
            "Content-Type": "application/json",
            "libCode": this.libraryIdSelected
        }
        const json = JSON.stringify(data)
        console.log(json)
        console.log(headers )
        axios({
            method: 'post',
            url: "http://localhost:8081/aa/authenticate",
            data: json,
            headers: headers
        }).then(res => {
            if(res.status === 200 && res.data.authenticated){
               console.log(res.data.jwtToken)     
               global.jwtToken = res.data.jwtToken
               global.libCode = this.props.libraryId
               global.username = this.state.userName
               this.setState({
                showLoginSuccess: true,
                showLoginFailure: false
               });
            }
        })
        .catch(error => {
            console.error(error)
            this.setState({
                showLoginSuccess: false,
                showLoginFailure: true
               });
        })
        
    }
    textHandler = (event) => {
        if(event.target.id === "exampleInputEmail1"){
            this.setState({userName: event.target.value})
        }
        if(event.target.id === "exampleInputPassword1"){
            this.setState({password: event.target.value})
        }        
    }
    render(){        
        return <div>
                <div className="alert alert-success" role="alert" hidden={!this.state.showLoginSuccess}>
                    Login success! May the power be with you
                </div>
                <div className="alert alert-danger" role="alert" hidden={!this.state.showLoginFailure}>
                    Oops! Try again. Login failed
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">Your library</label>
                    <input type="text" value={this.state.libraryName} className="form-control" disabled/>                    
                    <input type="hidden" value={this.state.libraryCode}/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Username</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" onChange={this.textHandler}/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"  onChange={this.textHandler}/>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                </div>
                <button className="btn btn-primary" onClick={this.loginHandler}>Submit</button>
                </div>
    }
}
export default Login;