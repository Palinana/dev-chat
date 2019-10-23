import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';
import md5 from 'md5';

import './Signup.css'

class Signup extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    isFormValid = () => {
        let error = '';
        let errors = [];

        if(this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all the fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        }
        else if(!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;
        }
        else {
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        }
        else if(password !== passwordConfirmation) {
             return false;
        }
        else { 
            return true;
        }
    }

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
        if(this.isFormValid()) {
            this.setState({ errors: [], loading: true })        
            firebase
                .auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log('createUser ',createdUser)
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser)
                            .then(() => {
                                console.log('user saved ');
                            })
                        this.setState({ loading: false });
                    })
                    .catch(err => {
                        console.log('err ',err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false });
                    });
                })
                .catch(err => {
                    console.log('err ',err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                });
        }
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return ( 
            <div className="container">
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h1 className="overlay__title">Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="btn__auth" id="signIn"><Link to="/login">Login</Link></button>
                        </div>
                    </div>
                </div>
                
                <div className="form-container sign-up-container">
                    <form action="#" onSubmit={this.handleSubmit}>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input 
                            name="username" 
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'username')}
                        />
                        <input 
                            name="email" 
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'email')}
                        />
                        <input 
                            name="password" 
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'password')}
                        />
                        <input 
                            name="passwordConfirmation" 
                            type="password"
                            value={passwordConfirmation}
                            placeholder="Password Confirmation"
                            onChange={this.handleChange}
                            className={this.handleInputErrors(errors, 'password')}
                        />
                        { errors.length > 0 && (
                            <div className="form__error-signup">
                                {this.displayErrors(errors)}
                            </div>
                        )}
                        <button>Sign Up</button>
                    </form>
                </div>        
            </div>
        )
    }
}

export default Signup;
