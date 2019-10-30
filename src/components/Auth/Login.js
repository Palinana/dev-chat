import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

import './Login.css';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }

    isFormValid = ({ email, password }) => email && password;

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleInputErrors = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)
            ) 
            ? 'error' 
            : '';
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })        
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log('signedInUser ', signedInUser)
            })
            .catch(err => {
                console.log('err ',err);
                this.setState({ errors: this.state.errors.concat(err), loading: false });
            });
        }
    }

    render() {
        const { email, password, errors, loading } = this.state;

        return (
            <div className="container">
                <div className="form-container sign-in-container">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <h1 className="form__title">Login</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your account</span>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            name="email"
                            value={email}
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'email')}
                            
                        />
                        <input 
                            type="password" 
                            placeholder="Password"
                            name="password"  
                            value={password}
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'password')}
                        />
                        { errors.length > 0 && (
                            <div className="form__error">
                                {this.displayErrors(errors)}
                            </div>
                        )}
                        <a href="#" className="link__password">Forgot your password?</a>
                        <button className="btn__auth--main">Login</button>
                    </form>
                </div>

                <div className="sign-in-overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <Link to="/signup"><button className="btn__auth" id="signUp">Sign Up</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
